const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')
const moment = require('moment')


router.get('/new', (req, res) => {
  Category.find({})
    .sort({ _id: 'asc' })
    .lean()
    .then(categories => res.render('new', { categories }))
})

// 新增資料
// router.post('/', (req, res) => {
//   req.body.userID = req.user._id
//   if (req.body.category) {}
//   Record.create(req.body)
//     .then(() => res.redirect('/'))
//     .catch(err => console.log(err))
// })

router.post('/', (req, res) => {
  const { name, date, category, amount } = req.body
  const userID = req.user._id
  const errors = []
  if (!name || !date || !category || !amount) {
    errors.push({ message: '必填欄位不能空白！' })
  }

  if (name.length > 8) {
    errors.push({ message: '名稱最多八個字' })
  }

  if (amount.length > 8) {
    errors.push({ message: '金額最多八位數' })
  }
  if (errors.length) {
    return Category.find({})
      .lean()
      .sort({ _id: 'asc' })
      .then(categories => {
        categories.forEach(item => {
          if (item._id.toString() === category) {
            item.selected = 'selected'
          }
        })
        res.render('new', {
          errors,
          name,
          date,
          categories,
          amount
        })
      })
  }
  req.body.userID = userID
  Record.create(req.body)
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})


router.get('/:id/edit', (req, res) => {
  const userID = req.user._id
  const _id = req.params.id
  Category.find({})
    .sort({ _id: 'asc' })
    .lean()
    .then(categories => {
      Record.findOne({ _id, userID })
        .lean()
        .populate('category')
        .then(record => {
          record.date = moment(record.date).format('YYYY-MM-DD')
          categories.forEach(category => {
            if (category._id.toString() === record.category._id.toString()) {
              category.selected = 'selected'
            }
          })
          res.render('edit', { record, categories })
        })
    })

})

// 修改
router.put('/:id', (req, res) => {
  const _id = req.params.id
  const { name, date, category, amount } = req.body
  const userID = req.user._id
  const errors = []
  if (!name || !date || !category || !amount) {
    errors.push({ message: '必填欄位不能空白！' })
  }

  if (name.length > 8) {
    errors.push({ message: '名稱最多八個字' })
  }

  if (amount.length > 8) {
    errors.push({ message: '金額最多八位數' })
  }
  if (errors.length) {
    return Category.find({})
      .sort({ _id: 'asc' })
      .lean()
      .then(categories => {
        Record.findOne({ _id, userID })
          .lean()
          .populate('category')
          .then(record => {
            record.date = moment(record.date).format('YYYY-MM-DD')
            categories.forEach(category => {
              if (category._id.toString() === record.category._id.toString()) {
                category.selected = 'selected'
              }
            })
            record.name = name
            record.date = date
            record.amount = amount
            res.render('edit', {
              record,
              errors,
              categories
            })
          })
      })
  }

  Record.findByIdAndUpdate({ _id, userID }, req.body)
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})



// 刪除
router.delete('/:id', (req, res) => {
  const userID = req.user._id
  const _id = req.params.id
  Record.findByIdAndDelete({ _id, userID })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

module.exports = router