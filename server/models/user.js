'use strict';
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    image_url: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: async function(user) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      } 
    }
  });

  User.prototype.validPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  }

  User.associate = function(models) {
    User.hasMany(models.Post, {
      foreignKey: 'creator_id',
      as: 'posts'
    });
    User.hasMany(models.Follow, {
      foreignKey: 'target_id',
      as: 'followers'
    });
    User.hasMany(models.Follow, {
      foreignKey: 'follower_id',
      as: 'following'
    });
    User.hasMany(models.Transaction, {
      foreignKey: 'buyer_id',
      as: 'buy'
    });
    User.hasMany(models.Transaction, {
      foreignKey: 'seller_id',
      as: 'sell'
    });
  };

  return User;
};
