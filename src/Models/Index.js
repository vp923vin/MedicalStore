const Sequelize = require('sequelize');
const sequelize = require('../Configs/db');

const User = require('./User')(sequelize, Sequelize.DataTypes);
const Role = require('./Role')(sequelize, Sequelize.DataTypes);
const Product = require('./Product')(sequelize, Sequelize.DataTypes);
const Category = require('./Category')(sequelize, Sequelize.DataTypes);
const SubCategory = require('./SubCategory')(sequelize, Sequelize.DataTypes);
const Order = require('./Order')(sequelize, Sequelize.DataTypes);
const Payment = require('./Payment')(sequelize, Sequelize.DataTypes);
const Inventory = require('./Inventory')(sequelize, Sequelize.DataTypes);
const OrderShipping = require('./OrderShipping')(sequelize, Sequelize.DataTypes);
const Wishlist = require('./Wishlist')(sequelize, Sequelize.DataTypes);
const Checkout = require('./Checkout')(sequelize, Sequelize.DataTypes);
const Invoice = require('./Invoice')(sequelize, Sequelize.DataTypes);
const OrderItem = require('./OrderItem')(sequelize, Sequelize.DataTypes);
const Prescription = require('./Prescription')(sequelize, Sequelize.DataTypes);
const PasswordReset = require('./PasswordReset')(sequelize, Sequelize.DataTypes);
const OTPManager = require('./OTPManager')(sequelize, Sequelize.DataTypes);
const UserPermission = require('./UserPermission')(sequelize, Sequelize.DataTypes);
const SupportHelp = require('./SupportHelp')(sequelize, Sequelize.DataTypes);
const UserDeliveryAddress = require('./UserDeliveryAddress')(sequelize, Sequelize.DataTypes);

const db = {
  sequelize,
  Sequelize,
  User,
  Role,
  Product,
  Category,
  SubCategory,
  Order,
  Payment,
  Inventory,
  OrderShipping,
  Wishlist,
  Checkout,
  Invoice,
  OrderItem,
  Prescription,
  PasswordReset,
  OTPManager,
  UserPermission,
  SupportHelp,
  UserDeliveryAddress,
};

module.exports = db;
