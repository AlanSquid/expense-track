const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')
const moment = require('moment')

router.get('/', (req, res) => {
  let totalAmount = 0
  Category.find({})
    .lean()
    .sort({ _id: 'asc' })
    .then(categories => {
      Record.find({})
        .lean()
        .populate('category')
        .sort({ date: 'desc' })
        .then(records => {
          records.map(record => {
            record.date = moment(record.date).format('YYYY-MM-DD')
            totalAmount += record.amount
          })
          res.render('index', { records, categories, totalAmount })
        })
    })
})

module.exports = router


