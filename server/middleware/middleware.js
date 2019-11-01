const { check, validationResult } = require('express-validator')
const moment = require('moment')
const crypto = require("crypto"); // 加密
const nodemailer = require("nodemailer"); // 寄送 mail
const db = require('../models')
const Subscription = db.Subscription
const Comment = db.Comment

const sequelize = require('sequelize')
const Op = sequelize.Op

const URL = process.env.URL; //本地 domain 不接受，使用 ngrok 工具做臨時網址，取得的網址放這
const MerchantID = process.env.MERCHANT_ID; // 商店代號
const HashKey = process.env.HASH_KEY; //API 金鑰
const HashIV = process.env.HASH_IV; //API 金鑰
const PayGateWay = "https://ccore.newebpay.com/MPG/mpg_gateway"; //付款網址
const ReturnURL = URL + "/api/users/subscribe/spgateway/callback?from=ReturnURL"; //支付完成返還商店網址
const NotifyURL = URL + "/api/users/subscribe/spgateway/callback?from=NotifyURL"; //支付通知網址
const ClientBackURL = URL + "/subscribe"; //支付取消返回網址

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_ACCOUNT,
    pass: process.env.GMAIL_PASSWORD,
  },
})
// 將資料轉成字串
const genDataChain = (TradeInfo) => {
  let results = [];
  for (let kv of Object.entries(TradeInfo)) {
    results.push(`${kv[0]}=${kv[1]}`);
  }
  return results.join("&");
}

// 轉成字串後 AES 加密
const create_mpg_aes_encrypt = (TradeInfo) => {
  let encrypt = crypto.createCipheriv("aes256", HashKey, HashIV);
  let enc = encrypt.update(genDataChain(TradeInfo), "utf8", "hex");
  return enc + encrypt.final("hex");
}

// 加密後再用 sha 做雜湊
const create_mpg_sha_encrypt = (TradeInfo) => {
  let sha = crypto.createHash("sha256");
  let plainText = `HashKey=${HashKey}&${TradeInfo}&HashIV=${HashIV}`;

  return sha
    .update(plainText)
    .digest("hex")
    .toUpperCase();
}

let middleware = {
  creatUser: [
    check('email')
      .not().isEmpty().withMessage('Email should be not empty')
      .isEmail().withMessage('This is not Email address'),
  ],
  validRestaurantForm: [
    check('name')
      .not().isEmpty().withMessage('Name should be not empty'),
    check('description')
      .not().isEmpty().withMessage('Description should be not empty'),
    check('tel')
      .not().isEmpty().withMessage('Phone should be not empty'),
    check('address')
      .not().isEmpty().withMessage('Address should be not empty')
  ],
  validMenuForm: [
    check('quantity')
      .not().isEmpty().withMessage('Quantity should be not empty'),
  ],
  validDishForm: [
    check('name')
      .not().isEmpty().withMessage('Name should be not empty'),
    check('description')
      .not().isEmpty().withMessage('Description should be not empty'),
  ],
  validUserProfile: [
    check('name')
      .not().isEmpty().withMessage('Name should be not empty'),
    check('email')
      .not().isEmpty().withMessage('Email should be not empty')
      .isEmail().withMessage('This is not Email address'),
    check('address')
      .not().isEmpty().withMessage('Address should be not empty'),
    check('dob')
      .not().isEmpty().withMessage('Birthday should be not empty'),
    check('prefer')
      .not().isEmpty().withMessage('Prefer should be not empty'),
  ],
  validOrderForm: [
    check('require_date')
      .not().isEmpty().withMessage('Require_date should be not empty'),
    check('quantity')
      .not().isEmpty().withMessage('Quantity should be not empty')
      .isInt().withMessage('Quantity should be a integer'),
  ],
  validComment: [
    check('user_text')
      .not().isEmpty().withMessage('user_text should be not empty'),
    check('rating')
      .not().isEmpty().withMessage('You are not rating the restaurant yet.'),
  ],
  validMessage: (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 'error', errors: errors.array(), message: 'Information should be filled' });
    }
  },
  getTimeStop: (opening_hour, closing_hour) => {
    let openingHour = moment(opening_hour, 'HH:mm')
    let closingHour = moment(closing_hour, 'HH:mm')
    let array = []
    while (openingHour < closingHour) {
      array.push(new moment(openingHour).format('HH:mm'))
      openingHour.add(30, 'minute')
    }
    return array
  },
  validSubsribe: async (req, res, next) => {
    try {
      let start = moment().startOf('day').toDate()
      const subscription = await Subscription.findOne({
        where: {
          UserId: req.user.id,
          payment_status: true,
          sub_expired_date: { [Op.gte]: start },
        },
        order: [['sub_expired_date', 'DESC']]
      })
      if (!subscription) return res.status(400).json({ status: 'error', message: 'You need to subscribe next meal now.' })
      next()
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error })
    }
  },
  getTradeInfo: (Amt, ItemDesc, description, email) => {
    data = {
      MerchantID: MerchantID, // 商店代號
      RespondType: "JSON", // 回傳格式
      TimeStamp: Date.now(), // 時間戳記
      Version: 1.5, // 串接程式版本
      MerchantOrderNo: Date.now(), // 商店訂單編號
      LoginType: 0, // 智付通會員
      OrderComment: description, // 商店備註
      Amt: Amt, // 訂單金額
      ItemDesc: ItemDesc, // 產品名稱
      Email: email, // 付款人電子信箱
      ReturnURL: ReturnURL, // 支付完成返回商店網址
      NotifyURL: NotifyURL, // 支付通知網址/每期授權結果通知
      ClientBackURL: ClientBackURL,
      CREDIT: 1  // 支付取消返回商店網址
    };
    mpg_aes_encrypt = create_mpg_aes_encrypt(data);
    mpg_sha_encrypt = create_mpg_sha_encrypt(mpg_aes_encrypt);
    tradeInfo = {
      MerchantID: MerchantID, // 商店代號
      TradeInfo: mpg_aes_encrypt, // 加密後參數
      TradeSha: mpg_sha_encrypt,
      Version: 1.5, // 串接程式版本
      PayGateWay: PayGateWay,
      MerchantOrderNo: data.MerchantOrderNo
    };
    return tradeInfo;
  },
  // 交易完成後回傳資料使用的反向解密
  create_mpg_aes_decrypt: (TradeInfo) => {
    let decrypt = crypto.createDecipheriv("aes256", HashKey, HashIV);
    decrypt.setAutoPadding(false);
    let text = decrypt.update(TradeInfo, "hex", "utf8");
    let plainText = text + decrypt.final("utf8");
    let result = plainText.replace(/[\x00-\x20]+/g, "");
    return result;
  },
  createSubscription: async (req, res, tradeInfo) => {
    try {
      let subscription = await Subscription.create({
        UserId: req.user.id,
        sub_name: req.body.sub_name,
        sub_price: req.body.sub_price,
        payment_status: false,
        sub_description: req.body.sub_description,
        sub_balance: req.body.sub_balance,
        sn: tradeInfo.MerchantOrderNo,
      })
      return subscription
    } catch (error) {
      res.status(400).json({ status: 'error', message: error })
    }
  },
  sendEmail: async (req, res, subscription, data) => {
    try {
      const mailOptions = {
        from: process.env.GMAIL_ACCOUNT,
        to: process.env.GMAIL_ACCOUNT,
        subject: `恭喜你成功訂閱 NextMeal 。`,
        html: `
        <h1>Enjoy Your Next Meal!</h1>
        <h3>您這次的訂閱資訊</h3>
        <ul>
          <li>訂閱編號: ${subscription.sn}</li>
          <li>方案名稱: ${subscription.sub_name}</li>
          <li>訂閱價格: ${subscription.sub_price}</li>
          <li>訂閱餐點數: ${subscription.sub_balance} 餐</li>
          <li>訂閱日期: ${subscription.sub_date}</li>
          <li>有效期限: ${subscription.sub_expired_date}</li>
        </ul>
        ` // html body
      }
      await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error)
        } else {
          console.log('Email sent ' + info.response)
        }
      })
    } catch (error) {
      return res.status(400).json({ status: 'error', message: error })
    }
  },
  avgRating: async (res, restaurant, comment, order) => {
    try {
      let comments = await Comment.findAll({
        where: { RestaurantId: restaurant.id },
        attributes: [[sequelize.fn('avg', sequelize.col('rating')), 'average']]
      })
      await restaurant.update({
        rating: comments[0].dataValues.average.toFixed(2) || 0
      })
      await order.update({
        hasComment: true
      })
      return res.status(200).json({ status: 'success', comment, message: 'Successfully post comment.' })
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error })
    }
  }
}

module.exports = middleware