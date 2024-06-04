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
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'inventory',
    timestamps: false
});

// Associations
Inventory.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasOne(Inventory, { foreignKey: 'product_id' });

module.exports = Inventory;
