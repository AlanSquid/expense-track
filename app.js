const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const Expense = require('./models/expense')

const PORT = 3000

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

require('./config/mongoose')
const app = express()

app.use(express.static('public'))

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
  Expense.find({})
    .lean()
    .then(expenses => res.render('index', { expenses }))
    .catch(err => console.log(err))
})

app.get('/expenses/new', (req, res) => {
  res.render('new')
})

// 新增資料
app.post('/expenses', (req, res) => {
  Expense.create(req.body)
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})


app.get('/expenses/:id/edit', (req, res) => {
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
app.put('/expenses/:id', (req, res) => {
  const _id = req.params.id
  console.log(req.body)
  Expense.findByIdAndUpdate({ _id }, req.body)
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

// 刪除
app.delete('/expenses/:id', (req, res) => {
  const _id = req.params.id
  Expense.findByIdAndDelete({ _id })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})