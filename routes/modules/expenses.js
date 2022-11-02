const express = require('express')
const router = express.Router()
const Expense = require('../../models/expense')

router.get('/new', (req, res) => {
  res.render('new')
})

// 新增資料
router.post('/', (req, res) => {
  Expense.create(req.body)
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})


router.get('/:id/edit', (req, res) => {
  const _id = req.params.id
  Expense.findOne({ _id })
    .lean()
    .then(expense => res.render('edit', {
      expense,
      option1: 'home' === expense.category,
      option2: 'traffic' === expense.category,
      option3: 'amusement' === expense.category,
      option4: 'diet' === expense.category,
      option5: 'other' === expense.category
    }))
    .catch(err => console.log(err))
})

// 修改
router.put('/:id', (req, res) => {
  const _id = req.params.id
  console.log(req.body)
  Expense.findByIdAndUpdate({ _id }, req.body)
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// 刪除
router.delete('/:id', (req, res) => {
  const _id = req.params.id
  Expense.findByIdAndDelete({ _id })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

module.exports = router