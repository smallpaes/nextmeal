const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = 'ab87cc234aa7cd6'

const db = require('../models')
const Subscription = db.Subscription
const Restaurant = db.Restaurant
const Category = db.Category
const User = db.User
const Order = db.Order
const Meal = db.Meal

const crypto = require("crypto"); // 加密
const { validMessage } = require('../middleware/middleware')
const districts = require('../location/district.json')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const moment = require('moment')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
// const nodemailer = require("nodemailer"); // 寄送 mail

const pageLimit = 6

// import express-validator for validation
const { validationResult } = require('express-validator/check');

const URL = 'https://f798ad18.ngrok.io'; //本地 domain 不接受，使用 ngrok 工具做臨時網址，取得的網址放這
const MerchantID = 'MS38035958'; // 商店代號
const HashKey = 'WF1pmVp4AxMgFs13YrlZQPuirCd47ql6'; //API 金鑰
const HashIV = 'CFPnopI11rY5YolP'; //API 金鑰
const PayGateWay = "https://ccore.newebpay.com/MPG/mpg_gateway"; //付款網址
const ReturnURL = URL + "/api/user/subscribe/spgateway/callback?from=ReturnURL"; //支付完成返還商店網址
const NotifyURL = URL + "/api/user/subscribe/spgateway/callback?from=NotifyURL"; //支付通知網址
const ClientBackURL = URL + "/api"; //支付取消返回網址

// 放入 create_mpg_aes_encrypt 將交易資訊轉成字串，以便加密使用
function genDataChain(TradeInfo) {
  let results = [];
  for (let kv of Object.entries(TradeInfo)) {
    results.push(`${kv[0]}=${kv[1]}`);
  }
  return results.join("&");
}

function create_mpg_aes_encrypt(TradeInfo) {
  let encrypt = crypto.createCipheriv("aes256", HashKey, HashIV);
  let enc = encrypt.update(genDataChain(TradeInfo), "utf8", "hex");
  return enc + encrypt.final("hex");
}

function create_mpg_sha_encrypt(TradeInfo) {
  let sha = crypto.createHash("sha256");
  let plainText = `HashKey=${HashKey}&${TradeInfo}&HashIV=${HashIV}`;

  return sha
    .update(plainText)
    .digest("hex")
    .toUpperCase();
}

// 交易完成後回傳資料使用的反向解密
function create_mpg_aes_decrypt(TradeInfo) {
  let decrypt = crypto.createDecipheriv("aes256", HashKey, HashIV);
  decrypt.setAutoPadding(false);
  let text = decrypt.update(TradeInfo, "hex", "utf8");
  let plainText = text + decrypt.final("utf8");
  let result = plainText.replace(/[\x00-\x20]+/g, "");
  return result;
}

function getTradeInfo(Amt, Desc, email, sn) {
  console.log("===== getTradeInfo =====");
  console.log(Amt, Desc, email, sn);
  console.log("==========");

  data = {
    MerchantID: MerchantID, // 商店代號
    RespondType: "JSON", // 回傳格式
    TimeStamp: Date.now(), // 時間戳記
    Version: 1.5, // 串接程式版本
    MerchantOrderNo: (sn) ? sn : Date.now(), // 商店訂單編號
    LoginType: 0, // 智付通會員
    OrderComment: "OrderComment", // 商店備註
    Amt: Amt, // 訂單金額
    ItemDesc: Desc, // 產品名稱
    Email: email, // 付款人電子信箱
    ReturnURL: ReturnURL, // 支付完成返回商店網址
    NotifyURL: NotifyURL, // 支付通知網址/每期授權結果通知
    ClientBackURL: ClientBackURL // 支付取消返回商店網址
  };

  console.log("===== getTradeInfo: data =====");
  console.log(data);

  mpg_aes_encrypt = create_mpg_aes_encrypt(data);
  mpg_sha_encrypt = create_mpg_sha_encrypt(mpg_aes_encrypt);

  console.log("===== getTradeInfo: mpg_aes_encrypt, mpg_sha_encrypt =====");
  console.log(mpg_aes_encrypt);
  console.log(mpg_sha_encrypt);

  tradeInfo = {
    MerchantID: MerchantID, // 商店代號
    TradeInfo: mpg_aes_encrypt, // 加密後參數
    TradeSha: mpg_sha_encrypt,
    Version: 1.5, // 串接程式版本
    PayGateWay: PayGateWay,
    MerchantOrderNo: data.MerchantOrderNo
  };

  console.log("===== getTradeInfo: tradeInfo =====");
  console.log(tradeInfo);

  return tradeInfo;
}

let userController = {
  emailCheck: async (req, res) => {
    try {
      //check if email has been used
      const { email } = req.body
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(422).json({ status: 'error', message: 'invalid Email format' });
      }
      const user = await User.findOne({ where: { email } })
      //if user exsist , return error
      if (user) {
        return res.status(400).json({ status: 'error', message: 'Email has been used' })
      }
      //otherwise return success
      return res.status(200).json({ status: 'success', message: 'Valid email' })
    } catch (error) {
      res.json({ status: 'error', message: error })
    }


  },
  signUp: async (req, res) => {
    // check for empty input
    if (!req.body.name || !req.body.email || !req.body.password || !req.body.passwordCheck || !req.body.dob || !req.body.prefer || !req.body.address) {
      return res.json({ status: 'error', message: 'All fields are required' })
    }
    // check if password length is between 8-12
    if (req.body.password.length < 8 || req.body.password.length > 12) {
      return res.json({ status: 'error', message: 'Password should be between 8-12' })
    }
    // validate password
    if (req.body.password !== req.body.passwordCheck) {
      return res.json({ status: 'error', message: 'Two passwords do not match' })
    }

    try {
      // create user
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
        role: 'User',
        dob: req.body.dob,
        prefer: req.body.prefer,
        address: req.body.address,
        latitude: req.body.lat,
        longitude: req.body.lng,
        location: req.body.location
      })

      // check if the user has valid subscriptions
      const validSubscriptions = await user.getSubscriptions({ where: { payment_status: true, sub_expired_date: { [Op.gte]: new Date() } } })
      const subscription_status = validSubscriptions.length >= 1 ? true : false

      //generate a token for the user
      const payload = { id: user.id }
      const token = jwt.sign(payload, 'NextmealProject')

      return res.status(200).json({
        status: 'success', message: 'Successfully sign up', user: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
          subscription_status
        }, token
      })
    } catch (error) {
      res.json({ status: 'error', message: error })
    }
  },
  signIn: async (req, res) => {
    try {
      // check for empty field
      if (!req.body.email || !req.body.password) {
        return res.json({ status: 'error', message: 'Email and password are required' })
      }
      // check if user exists and password is correct
      const { email: userName, password: password } = req.body
      const user = await User.findOne({
        where: { email: userName }
      })
      if (!user) return res.status(401).json({ status: 'error', message: 'User does not exist' })

      // check if the user has valid subscriptions
      const validSubscriptions = await user.getSubscriptions({ where: { payment_status: true, sub_expired_date: { [Op.gte]: new Date() } } })
      const subscription_status = validSubscriptions.length >= 1 ? true : false


      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'Incorrect password' })
      }
      // generate and provide user with a token
      const payload = { id: user.id }
      const token = jwt.sign(payload, 'NextmealProject')
      return res.status(200).json({
        status: 'success', message: 'Successfully log in', token,
        user: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
          subscription_status
        }
      })

    } catch (error) {
      res.json({ status: 'error', message: error })
    }

  },
  getCategories: async (req, res) => {
    const categories = await Category.findAll()
    const category = categories.map(item => item.name)
    return res.json({ category })
  },
  getSubscription: async (req, res) => {
    try {
      let subscription = await Subscription.findAll({
        where: { UserId: req.user.id },
        order: [['createdAt', 'DESC']],
        limit: 1
      })
      if (subscription.length === 0 || subscription[0].payment_status === '0' || subscription[0].sub_expired_date < Date.now()) {
        return res.status(200).json({
          status: 'error',
          subscription: (subscription) ? subscription : '',
          message: 'you should subscribe the NextMeal now'
        })
      }
      return res.status(200).json({ status: 'error', subscription, message: 'you are already subscribe the NextMeal' })
    } catch (error) {
      res.status(500).json({ status: 'error', message: error })
    }
  },

  postSubscription: async (req, res) => {
    try {
      // 如果沒有訂單
      let subscription = await Subscription.findAll({
        where: { UserId: req.user.id },
        order: [['createdAt', 'DESC']],
        limit: 1
      })

      if (subscription.length > 0 && subscription[0].dataValues.sub_expired_date > Date.now()) {
        return res.status(200).json({ status: 'success', message: 'You still have an active subscrtiption.' })
      }
      if (subscription.length === 0 ||
        subscription[0].dataValues.payment_status !== '0' &&
        subscription[0].dataValues.sub_expired_date < Date.now()
      ) {
        const tradeInfo = getTradeInfo(req.body.sub_price, req.body.sub_name, req.user.email) //req.user.email
        let subscription = await Subscription.create({
          UserId: req.user.id,
          sub_name: req.body.sub_name,
          sub_price: req.body.sub_price,
          payment_status: 0,
          sub_balance: req.body.sub_balance,
          sn: tradeInfo.MerchantOrderNo,
        })
        return res.status(200).json({ status: 'success', subscription, tradeInfo, message: 'Successfully create a subscription' })
      }

      // 如果有訂單
      const tradeInfo = getTradeInfo(subscription[0].sub_price, subscription[0].sub_name, req.body.email, subscription[0].sn)
      return res.status(200).json({ status: 'success', subscription, tradeInfo, message: 'you can countinue to describe the NextMeal.' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ status: 'error', message: error })
    }
  },

  spgatewayCallback: async (req, res) => {
    try {
      // const data = JSON.parse(create_mpg_aes_decrypt(req.body.TradeInfo));
      console.log("===== spgatewayCallback =====");
      console.log(req.method); // 總共四次，回傳前 post 3 次，確認電商網站是否正常。
      console.log(req.query); // 回傳 { from: NotifyURL}，第四次回傳 { from: ReturnURL}
      console.log(req.body); // 回傳的 object 解碼使用
      console.log("==========");

      console.log("===== spgatewayCallback: TradeInfo =====");
      console.log(req.body.TradeInfo);

      const data = JSON.parse(create_mpg_aes_decrypt(req.body.TradeInfo))
      console.log("===== spgatewayCallback: create_mpg_aes_decrypt、data =====");
      console.log(data);
      let sub_date = new Date()
      let sub_expired_date = sub_date.setDate(sub_date.getDate() + 30)
      let subscription = await Subscription.findAll({ where: { sn: data['Result']['MerchantOrderNo'] } })
      subscription.update({
        ...req.body,
        payment_ststus: 1,
        sub_date: sub_date,
        sub_expired_date: sub_expired_date
      })

      return res.status(200).json({ status: 'success', data, message: 'Think you for subscribe NextMeal, enjoy your day.' })
    } catch (error) {
      res.status(500).json({ status: 'error', message: error })
    }
  },

  getProfile: async (req, res) => {
    try {
      if (req.user.id !== Number(req.params.user_id)) {
        return res.status(403).json({ status: 'error', message: 'You are not allow access this page.' })
      }
      const categories = await Category.findAll()
      const user = await User.findByPk(req.params.user_id, {
        attributes: {
          exclude: ['password']
        }
      })

      return res.status(200).json({ status: 'success', user, categories, districts, message: 'get personal profile page.' })
    } catch (error) {
      console.log(error)
      res.status(500).json({ status: 'error', message: error })
    }
  },
  putProfile: async (req, res) => {
    try {
      if (req.user.id !== Number(req.params.user_id) || req.user.role !== 'Admin') {
        return res.status(403).json({ status: 'error', message: 'You are not allow edit this profile.' })
      }
      validMessage(req, res)
      let user = await User.findByPk(req.params.user_id)
      const { file } = req
      // 如果上有照片
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, async (err, img) => {
          await user.update({
            ...req.body,
            avatar: file ? img.data.link : user.avatar,
          })
          return res.status(200).json({
            status: 'success',
            message: 'Successfully update user profile with image.'
          })
        })
      } else {
        // 如果沒上傳照片
        await user.update({
          ...req.body
        })
        res.status(200).json({ status: 'success', user, message: 'Successfully update user profile.' })
      }
    } catch (error) {
      console.log(error)
      res.status(500).json({ status: 'error', message: error })
    }
  },

  getTomorrow: async (req, res) => {
    try {
      let start = moment().add(1, 'days').startOf('day').toDate()
      let end = moment().add(1, 'days').endOf('day').toDate()
      let order = await Order.findAll({
        where: {
          UserId: req.user.id,
          require_date: { [Op.gte]: start, [Op.lte]: end },
          order_status: { [Op.notLike]: '取消' }
        },
        include: [{
          model: Meal,
          as: 'meals',
          include: [{ model: Restaurant, attributes: ['id', 'name', 'rating'] }],
          attributes: ['id', 'name', 'description', 'image']
        }],
        attributes: ['id', 'require_date']
      })

      if (!order) return res.status(400).json({ status: 'error', message: 'not order yet.' })
      return res.status(200).json({ status: 'success', order, message: 'getTomorrow.' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ status: 'error', message: error })
    }
  },

  getOrders: async (req, res) => {
    try {
      const { page, status } = req.query
      let pageNum = (Number(page) < 1 || page === undefined) ? 1 : Number(page)
      if (!status &&
        status !== 'today' &&
        status !== 'tomorrow' &&
        status !== 'cancel' &&
        status !== 'history'
      ) return res.status(400).json({
        status: 'error',
        message: 'should be query string like today、tomorrow、cancel、history'
      })
      let start, end
      let whereQuery = {
        UserId: req.user.id,
        order_status: { [Op.notLike]: '取消' },
      }
      if (status === 'today') {
        start = moment().startOf('day').toDate()
        end = moment().endOf('day').toDate()
        whereQuery['require_date'] = { [Op.gte]: start, [Op.lte]: end }
      }
      if (status === 'tomorrow') {
        start = moment().add(1, 'days').startOf('day').toDate()
        end = moment().add(1, 'days').endOf('day').toDate()
        whereQuery['require_date'] = { [Op.gte]: start, [Op.lte]: end }
      }
      if (status === 'cancel') { whereQuery['order_status'] = '取消' }
      let orders = await Order.findAndCountAll({
        where: whereQuery,
        include: [{
          model: Meal,
          as: 'meals',
          include: [{ model: Restaurant, attributes: ['id', 'name', 'rating'] }],
          attributes: ['id', 'name', 'description', 'image']
        }],
        attributes: { exclude: ['updatedAt', 'updatedAt'] },
        order: [['require_date', 'ASC']],
        offset: (pageNum - 1) * pageLimit,
        limit: pageLimit,
      })
      console.log(orders);
      if (!orders) return res.status(400).json({ status: 'error', message: 'not order yet.' })
      let count = orders.count
      orders = orders.rows.map(order => ({
        ...order.dataValues,
        meals: order.dataValues.meals[0]
      }))
      let pages = Math.ceil((count) / pageLimit)
      return res.status(200).json({ status: 'success', orders, pages, message: 'Successfully get orders.' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ status: 'error', message: error })
    }
  },
}

module.exports = userController