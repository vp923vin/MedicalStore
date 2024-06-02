const { DataTypes } = require('sequelize');
const sequelize = require('../Configs/db');
const Category = require('./categoryModel');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    stock_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    available_stock_status: {
        type: DataTypes.ENUM('in_stock', 'out_of_stock'),
        allowNull: false,
        defaultValue: 'in_stock',
    },
    expiry_status: {
        type: DataTypes.ENUM('valid', 'expired'),
        allowNull: false,
        defaultValue: 'valid',
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Category,
            key: 'id',
        },
    },
    manufacturer: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expiry_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'products',
    timestamps: false,
});

// Define relationships
Category.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(Category, { foreignKey: 'category_id' });

module.exports = Product;
