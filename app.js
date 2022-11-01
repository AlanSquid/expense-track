const express = require('express')
const exphbs = require('express-handlebars')

const PORT = 3000

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

require('./config/mongoose')
const app = express()

app.use(express.static('public'))

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/expenses/new', (req, res) => {
  res.render('new')
})


app.get('/expenses/edit/id', (req, res) => {
  res.render('edit')
})

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})