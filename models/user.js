'use strict';
module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define('user', {
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    bio: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    //allergie: DataTypes.,
    age: DataTypes.INTEGER
  }, {});
  user.associate = function(models) {
    // associations can be defined here
    models.user.hasMany(models.message);
  };
  return user;
};