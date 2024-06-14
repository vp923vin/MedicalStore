const { DataTypes } = require('sequelize');
const sequelize = require('../Configs/db');
const Product = require('./productModel');

const Inventory = sequelize.define('Inventory', {
  inventory_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'products',
      key: 'product_id'
    },
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  min_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  max_quantity: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  warehouse_location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  last_restocked: {
    type: DataTypes.DATE,
    allowNull: true
  },
  last_sold: {
    type: DataTypes.DATE,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'inventories',
  timestamps: false,
});

// Associations
Inventory.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Product.hasMany(Inventory, { foreignKey: 'product_id', as: 'inventory' });

module.exports = Inventory;

