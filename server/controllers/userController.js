const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const URL = process.env.URL

const db = require('../models')
const Subscription = db.Subscription
const Restaurant = db.Restaurant
const Category = db.Category
const Payment = db.Payment
const Order = db.Order
const User = db.User
const Meal = db.Meal
const {
  getTradeInfo,
  createSubscription,
  create_mpg_aes_decrypt,
  sendEmail
} = require('../middleware/middleware')
const districts = require('../location/district.json')
const plan = require('../location/plan.json')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pageLimit = 6

const moment = require('moment')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
let userController = {
  emailCheck: async (req, res) => {
    try {
      //check if email has been used
      const { email } = req.body

      const user = await User.findOne({ where: { email } })
      //if user exsist , return error
      if (user) {
        return res.status(200).json({ status: 'error', isAvailable: false, message: 'Email has been used' })
      }
      //otherwise return success
      return res.status(200).json({ status: 'success', isAvailable: true, message: 'Valid email' })
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

    // check if email has been used
    const duplicate_email = await User.findOne({ where: { email: req.body.email } })
    if (duplicate_email) {
      return res.status(422).json({ status: 'error', message: 'This email has aleady been used' })
    }

    const point = Sequelize.fn('ST_GeomFromText', `POINT(${req.body.lng} ${req.body.lat})`)
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
      const sub_status = validSubscriptions.length >= 1 ? true : false

      //generate a token for the user
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)

      return res.status(200).json({
        status: 'success', message: 'Successfully sign up', user: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
          sub_status
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
      const sub_status = validSubscriptions.length >= 1 ? true : false
      const sub_balance = validSubscriptions.length >= 1 ? validSubscriptions[0].sub_balance : 0


      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'Incorrect password' })
      }
      // generate and provide user with a token
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.status(200).json({
        status: 'success', message: 'Successfully log in', token,
        user: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
          sub_status,
          sub_balance
        }
      })

    } catch (error) {
      return res.json({ status: 'error', message: error })
    }

  },
  getCategories: async (req, res) => {
    const categories = await Category.findAll()
    const category = categories.map(item => item.name)
    return res.json({ category })
  },
  getSubscription: (req, res) => {
    return res.status(200).json({
      status: 'success',
      plan,
      message: 'you should subscribe the NextMeal now'
    })
  },

  postSubscription: async (req, res) => {
    try {
      if (!req.body.sub_price || !req.body.sub_name || !req.user.email || !req.body.sub_description || !req.body.sub_balance) {
        return res.status(400).json({ status: 'error', message: 'need sub_price、sub_balance、sub_description、sub_name、user\'s email' })
      }
      let subscription = await Subscription.findOne({
        where: { UserId: req.user.id },
        order: [['updatedAt', 'DESC']],
        limit: 1
      })

      if (!subscription) {
        const tradeInfo = getTradeInfo(req.body.sub_price, req.body.sub_name, req.body.sub_description, req.user.email)
        subscription = await createSubscription(req, res, tradeInfo)
        return res.status(200).json({ status: 'success', subscription, tradeInfo, message: 'Successfully create a subscription' })
      }
      if (subscription) {
        const stillSubscribe = subscription.sub_expired_date > Date.now()
        const unSubscribe = subscription.sub_expired_date < Date.now()
        const paid = subscription.payment_status !== false
        const insufficient = subscription.sub_balance <= 0
        const once = (subscription && stillSubscribe && paid && insufficient) ? true : false
        const expired = (subscription && paid && unSubscribe) ? true : false
        // 有效訂單
        if (stillSubscribe && !once && !expired) {
          return res.status(400).json({ status: 'error', message: 'You still have an active subscrtiption.' })
        }
        // 曾經訂閱
        if (expired || once) {
          const tradeInfo = getTradeInfo(req.body.sub_price, req.body.sub_name, req.body.sub_description, req.user.email)
          subscription = await createSubscription(req, res, tradeInfo)
          return res.status(200).json({ status: 'success', subscription, tradeInfo, message: 'Successfully create a subscription' })
        }
        // 如果有訂單，但還沒付款，先產生新 trandeInfo 記得傳入 sn，如果選擇的方案不相同，修改方案
        const tradeInfo = getTradeInfo(
          subscription.sub_price,
          subscription.sub_name,
          req.body.sub_description,
          req.user.email
        )
        subscription = await subscription.update({
          sub_name: req.body.sub_name,
          sub_price: req.body.sub_price,
          sub_balance: req.body.sub_balance,
          sub_description: req.body.sub_description,
          sn: tradeInfo.MerchantOrderNo
        })
        // 如果有訂單，選擇的方案相同
        return res.status(200).json({ status: 'success', subscription, tradeInfo, message: 'you can countinue to describe the NextMeal.' })
      }
    } catch (error) {
      res.status(500).json({ status: 'error', message: error })
    }
  },

  spgatewayCallback: async (req, res) => {
    try {
      if (req.query.from === 'NotifyURL') {
        res.status(200).json({ status: 'success', data, message: 'Get the NotifyURL.' })
      }
      if (req.query.from === 'ReturnURL') {
        const data = JSON.parse(create_mpg_aes_decrypt(req.body.TradeInfo))
        let sub_date = moment().toDate()
        let sub_expired_date = moment().add(30, 'days').endOf('day').toDate()
        let subscription = await Subscription.findOne({
          where: { sn: data['Result']['MerchantOrderNo'] },
          include: [{ model: User, attributes: ['name', 'email'] }]
        })
        await Payment.create({
          SubscriptionId: subscription.id,
          params: req.body.Status,
          amount: data.Result.Amt,
          paidAt: new Date(),
          sn: data.Result.MerchantOrderNo
        })
        if (req.body.Status === 'SUCCESS') {
          await subscription.update({
            ...req.body,
            payment_status: true,
            sub_date: sub_date,
            sub_expired_date: sub_expired_date
          })
          await sendEmail(req, res, subscription, data)
        }
        return res.redirect(`${URL}/users/orders/tomorrow/`)
        // return res.status(200).json({ status: 'success', data, message: 'Think you for subscribe NextMeal, enjoy your day.' })
      }
    } catch (error) {
      res.status(500).json({ status: 'error', message: error })
    }
  },

  getProfile: async (req, res) => {
    try {
      // if (req.user.id !== Number(req.params.user_id)) {
      //   return res.status(400).json({ status: 'error', message: 'You are not allow access this page.' })
      // }
      const categories = await Category.findAll()
      const user = await User.findByPk(req.user.id, {
        attributes: {
          exclude: ['password']
        }
      })
      return res.status(200).json({ status: 'success', user, categories, districts, message: 'get personal profile page.' })
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error })
    }
  },
  putProfile: async (req, res) => {
    try {

      // if params exist,it means you access this action as Admin
      const user_id = req.params.user_id || req.user.id
      // if params exist,it means you access this action as Admin ,hence you can set roles for users
      const user_role = req.params.user_id ? req.body.role : req.user.role


      const point = Sequelize.fn('ST_GeomFromText', `POINT(${req.body.lng} ${req.body.lat})`)
      let user = await User.findByPk(user_id)

      // check if email has been used
      const duplicate_email = await User.findOne({ where: { email: req.body.email } })
      if (duplicate_email && duplicate_email.email !== user.email) {
        return res.status(422).json({ status: 'error', message: 'This email has aleady been used' })
      }
      const { file } = req
      // 如果上有照片
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, async (err, img) => {
          await user.update({
            name: req.body.name,
            email: req.body.email,
            address: req.body.address,
            dob: req.body.dob,
            prefer: req.body.prefer,
            lat: req.body.lat,
            lng: req.body.lng,
            role: user_role,
            location: req.body.location,
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
          name: req.body.name,
          email: req.body.email,
          address: req.body.address,
          dob: req.body.dob,
          prefer: req.body.prefer,
          lat: req.body.lat,
          lng: req.body.lng,
          role: user_role,
          location: req.body.location,
          geometry: point,
        })
        res.status(200).json({ status: 'success', user, message: 'Successfully update user profile.' })
      }
    } catch (error) {
      console.log(error);
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
      // 11/1 由於上方是findAll 此處更改為判斷陣列的長度
      if (order.length === 0) return res.status(400).json({ status: 'error', message: 'not order yet.' })
      return res.status(200).json({ status: 'success', order, message: 'getTomorrow.' })
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error })
    }
  },

  getOrders: async (req, res) => {
    try {
      const { page, order_status } = req.query
      let pageNum = (Number(page) < 1 || page === undefined) ? 1 : Number(page)
      if (!order_status &&
        order_status !== 'today' &&
        order_status !== 'tomorrow' &&
        order_status !== 'cancel' &&
        order_status !== 'history'
      ) return res.status(400).json({
        status: 'error',
        message: 'should be query string like today、tomorrow、cancel、history'
      })
      let start, end
      let whereQuery = {
        UserId: req.user.id,
        order_status: { [Op.notLike]: '取消' },
      }
      if (order_status === 'today') {
        start = moment().startOf('day').toDate()
        end = moment().endOf('day').toDate()
        whereQuery['require_date'] = { [Op.gte]: start, [Op.lte]: end }
      }
      if (order_status === 'tomorrow') {
        start = moment().add(1, 'days').startOf('day').toDate()
        end = moment().add(1, 'days').endOf('day').toDate()
        whereQuery['require_date'] = { [Op.gte]: start, [Op.lte]: end }
      }
      if (order_status === 'cancel') { whereQuery['order_status'] = '取消' }
      if (order_status === 'history') {
        start = moment().startOf('day').toDate()
        whereQuery = {
          UserId: req.user.id,
          require_date: { [Op.lt]: start }
        }
      }
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
      if (orders.rows.length === 0) return res.status(400).json({ status: 'error', message: 'Can not found any order.' })
      let count = orders.count
      orders = orders.rows.map(order => ({
        ...order.dataValues,
        meals: order.dataValues.meals[0]
      }))
      let pages = Math.ceil((count) / pageLimit)
      return res.status(200).json({ status: 'success', orders, pages, message: 'Successfully get orders.' })
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error })
    }
  },
  getCurrentUser: async (req, res) => {
    try {
      const user = await User.findOne({
        where: { email: req.user.email }
      })

      // check if the user has valid subscriptions
      const validSubscriptions = await user.getSubscriptions({ where: { payment_status: true, sub_expired_date: { [Op.gte]: new Date() } } })
      const sub_status = validSubscriptions.length >= 1 ? true : false
      const sub_balance = validSubscriptions.length >= 1 ? validSubscriptions[0].sub_balance : 0

      return res.status(200).json({
        status: 'success',
        user: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
          sub_status,
          sub_balance
        }
      })

    } catch (error) {
      res.json({ status: 'error', message: error })
    }

  }
}

module.exports = userController