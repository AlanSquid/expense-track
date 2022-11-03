const db = require('../../config/mongoose')
const Category = require('../category')
const categoryData = require('./categoryData.json').results

db.once('open', () => {
  Category.create(categoryData)
    .then(() => {
      console.log('categorySeeder created!')
      process.exit()
    })
    .catch(err => console.log(err))
})