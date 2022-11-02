const mongoose = require('mongoose')

const expenseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true }
})

module.exports = mongoose.model('Expense', expenseSchema)