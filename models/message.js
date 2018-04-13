'use strict';
module.exports = (sequelize, DataTypes) => {
  var message = sequelize.define('message', {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    attachement: DataTypes.STRING,
    likes: DataTypes.INTEGER
  }, {});
  message.associate = function(models) {
    // associations can be defined here
    models.message.belongsTo(models.user, {
      foreignKey: {
          allowNull: false 
      }
  })
  };
  return message;
};