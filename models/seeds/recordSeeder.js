const db = require('../../config/mongoose')
const Record = require('../record')
const Category = require('../category')
const User = require('../user')
const recordData = require('./recordData.json').results
const bcrypt = require('bcryptjs')


const SEED_USERS = [
  {
    name: 'User1',
    email: 'user1@test.com',
    password: '123456'
  },
  {
    name: 'User2',
    email: 'user2@test.com',
    password: '123456'
  }
]

db.once('open', () => {
  Category.find({})
    .then(categories => {
      recordData.forEach(record => {
        record.category = categories.find(category => category.name === record.category)
      })
    })
    .then(() => {
      Promise.all(
        SEED_USERS.map((user, userIdx) => {
          return User.create({
            name: user.name,
            email: user.email,
            password: bcrypt.hashSync(user.password, 10)
          })
            .then(user => {
              const usersRecords = []
              recordData.forEach((record, recordIdx) => {
                if (recordIdx >= 3 * userIdx && recordIdx < 3 * (userIdx + 1)) {
                  record.userID = user._id
                  usersRecords.push(record)
                }
              })
              return Record.create(usersRecords)
            })
        })
      )
        .then(() => {
          console.log('recordSeeder created!')
          process.exit()
        })
        .catch(err => console.log(err))
    })
})

