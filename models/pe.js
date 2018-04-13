'use strict';
module.exports = (sequelize, DataTypes) => {
  var pe = sequelize.define('pe', {
    codeBarre: DataTypes.INTEGER,
    dangerous: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  pe.associate = function(models) {
    // associations can be defined here
  };
  return pe;
};