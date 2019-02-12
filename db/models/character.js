'use strict'

module.exports = (sequelize, DataTypes) => {
  const Character = sequelize.define('Character', {
    title: DataTypes.STRING,
    href: DataTypes.STRING,
    thumbnail: DataTypes.STRING
  }, {})
  Character.associate = function (models) {
    // associations can be defined here
  }
  return Character
}
