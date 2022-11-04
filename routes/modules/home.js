const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')
const moment = require('moment')


router.get('/', (req, res) => {
  let totalAmount = 0
  const categorySelector = []
  Category.find({})
    .lean()
    .sort({ _id: 'asc' })
    .then(categories => {
      categories.forEach(category => {
        // 下拉選單保留選擇項目
        if (category._id.toString() === req.query.category) {
          category.selected = 'selected'
          categorySelector.push(req.query.category)
          // 若沒選擇，就全選
        } else if (!req.query.category) {
          categorySelector.push(category)
        }
      })
      Record.find({ category: categorySelector })
        .lean()
        .populate('category')
        .sort({ date: 'desc' })
        .then(records => {
          records.forEach(record => {
            record.date = moment(record.date).format('YYYY-MM-DD')
            totalAmount += record.amount
          })
          res.render('index', { records, categories, totalAmount })
        })
    })
})

module.exports = router


