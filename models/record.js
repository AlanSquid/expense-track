const mongoose = require('mongoose')
const category = require('./category')

const recordSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }
})

module.exports = mongoose.model('Record', recordSchema)