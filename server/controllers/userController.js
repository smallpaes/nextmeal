const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = 'ab87cc234aa7cd6'
const db = require('../models')
const Subscription = db.Subscription
const User = db.User
const Category = db.Category
const { validMessage, getTradeInfo, createSubscription } = require('../middleware/middleware')
const districts = require('../location/district.json')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
// const nodemailer = require("nodemailer"); // 寄送 mail

let userController = {
  emailCheck: async (req, res) => {
    try {
      //check if email has been used
      const { email } = req.body
      validMessage(req, res)

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
    const point = sequelize.fn('ST_GeomFromText', `POINT(${req.body.lng} ${req.body.lat})`)
    try {
      // create user
      const user = await User.create({
        ...req.body,
        password: bcrypt.hashSync(req.body.password, 10),
        avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
        role: 'User',
        geometry: point,
      })

      // check if the user has valid subscriptions
      const validSubscriptions = await user.getSubscriptions({ where: { payment_status: true, sub_expired_date: { [Op.gte]: new Date() } } })
      const subscription_status = validSubscriptions.length >= 1 ? true : false

      //generate a token for the user
      const payload = { id: user.id }
      const token = jwt.sign(payload, 'NextmealProject')

      return res.json({
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
      return res.json({
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

      if (!req.body.sub_price || !req.body.sub_name || !req.user.email || !req.body.sub_description || !req.body.sub_balance) {
        return res.status(400).json({ status: 'error', message: 'need sub_price、sub_name、user\'s email' })
      }
      let subscription = await Subscription.findAll({
        where: { UserId: req.user.id },
        order: [['createdAt', 'DESC']],
        limit: 1
      })

      const newbie = (subscription.length === 0) ? true : false
      const haveSubscription = subscription.length > 0

      if (newbie) {
        const tradeInfo = getTradeInfo(req.body.sub_price, req.body.sub_name, req.user.email)
        subscription = await createSubscription(req, res, tradeInfo)
        return res.status(200).json({ status: 'success', subscription, tradeInfo, message: 'Successfully create a subscription' })
      }

      if (haveSubscription) {
        const stillSubscribe = subscription[0].dataValues.sub_expired_date > Date.now()
        const unSubscribe = subscription[0].dataValues.sub_expired_date < Date.now()
        const paid = subscription[0].dataValues.payment_status !== '0'
        const insufficient = subscription[0].dataValues.sub_balance <= 0
        const once = (haveSubscription && stillSubscribe && paid && insufficient) ? true : false
        const expired = (haveSubscription && paid && unSubscribe) ? true : false
        // 有效訂單
        if (stillSubscribe && !once && !expired) {
          return res.status(200).json({ status: 'success', message: 'You still have an active subscrtiption.' })
        }
        // 曾經訂閱
        if (expired || once) {
          const tradeInfo = getTradeInfo(req.body.sub_price, req.body.sub_name, req.user.email)
          subscription = await createSubscription(req, res, tradeInfo)
          return res.status(200).json({ status: 'success', subscription, tradeInfo, message: 'Successfully create a subscription' })
        }
        
        // 如果有訂單，但還沒付款，先產生新 trandeInfo 記得傳入 sn，如果選擇的方案不相同，修改方案
        const tradeInfo = getTradeInfo(subscription[0].sub_price, subscription[0].sub_name, req.user.email, subscription[0].sn)
        if (subscription[0].dataValues.sub_name !== req.body.sub_name) {
          subscription = await subscription.update({
            sub_name: req.body.sub_name,
            sub_price: req.body.sub_price,
            sub_balance: req.body.sub_balance
          })
        }
        // 如果有訂單，選擇的方案相同
        return res.status(200).json({ status: 'success', subscription, tradeInfo, message: 'you can countinue to describe the NextMeal.' })
      }
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
      // 將回傳交易訊息解密
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
      const point = sequelize.fn('ST_GeomFromText', `POINT(${req.body.lng} ${req.body.lat})`)
      let user = await User.findByPk(req.params.user_id)
      const { file } = req
      // 如果上有照片
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, async (err, img) => {
          await user.update({
            ...req.body,
            avatar: file ? img.data.link : user.avatar,
            geometry: point
          })
          return res.status(200).json({
            status: 'success',
            message: 'Successfully update user profile with image.'
          })
        })
      } else {
        // 如果沒上傳照片
        await user.update({
          ...req.body,
          geometry: point,
        })
        res.status(200).json({ status: 'success', user, message: 'Successfully update user profile.' })
      }
    } catch (error) {
      console.log(error)
      res.status(500).json({ status: 'error', message: error })
    }
  },
}

module.exports = userController