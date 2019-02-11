const Sequelize = require('sequelize')
const config = require('./config/config.js')

let NODE_ENV
if (process.env.NODE_ENV === undefined) {
  NODE_ENV = 'test'
} else {
  NODE_ENV = process.env.NODE_ENV
}

const sequelize = new Sequelize(config[NODE_ENV])

module.exports = {
  sequelize
}
