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
router.post('/', (req, res) => {
  Record.create(req.body)
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})


router.get('/:id/edit', (req, res) => {
  const _id = req.params.id
  Category.find({})
    .sort({ _id: 'asc' })
    .lean()
    .then(categories => {
      Record.findOne({ _id })
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
  Record.findByIdAndUpdate({ _id }, req.body)
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// 刪除
router.delete('/:id', (req, res) => {
  const _id = req.params.id
  Record.findByIdAndDelete({ _id })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

module.exports = router