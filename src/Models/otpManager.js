const { DataTypes } = require('sequelize');
const sequelize = require('../Configs/db');
const User = require('./userModel');

const OtpManager = sequelize.define('OtpManager', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
        model: 'users',
        key: 'user_id'
      }
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: true
  },
  auth_token: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  otp_reason: {
    type: DataTypes.ENUM('order_payment', 'password_reset', 'email_verify', 'login_user', 'order_delivered'),
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'otp_managers',
  timestamps: false
});

OtpManager.belongsTo(User, { foreignKey: 'user_id' }); 
User.hasMany(OtpManager, { foreignKey: 'user_id' });
module.exports = OtpManager;
