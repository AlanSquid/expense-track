const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')


router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: "/",
  failureRedirect: '/users/login',
  // if(!username || !password)的情況下預設會回傳Missing credentials，以下更改
  badRequestMessage: '帳號密碼不能為空白',
  failureFlash: true
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  User.findOne({ email })
    .then(user => {
      if (user) {
        console.log('此信箱已經註冊過')
      }
      User.create(req.body)
        .then(() => res.redirect('/'))
    })
    .catch(err => console.log(err))
})

router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) { return next(err) }
    // req.flash('success_msg', '您已成功登出。')
    res.redirect('/users/login')
  })
})

module.exports = router

