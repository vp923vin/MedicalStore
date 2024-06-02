const { DataTypes } = require('sequelize');
const sequelize = require('../Configs/db');
const User = require('./userModel');
const Product = require('./productModel');
const DeliveryAddress = require('./deliveryAddressModel');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    off_payment_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    online_payment_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    pid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Product,
            key: 'id',
        },
    },
    order_status: {
        type: DataTypes.ENUM('pending', 'completed', 'canceled'),
        allowNull: false,
        defaultValue: 'pending',
    },
    order_placed_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    order_completed_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    product_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    total_payable_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    payment_mode: {
        type: DataTypes.ENUM('online', 'offline'),
        allowNull: false,
    },
    payment_status: {
        type: DataTypes.ENUM('paid', 'pending', 'failed'),
        allowNull: false,
        defaultValue: 'pending',
    },
    online_pay_by: {
        type: DataTypes.STRING(100), // method chooses in online payment
        allowNull: true,
    },
    offline_pay_by: {
        type: DataTypes.STRING(100), // method chooses in offline payment
        allowNull: true,
    },
    shipping_address_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: DeliveryAddress,
            key: 'id',
        },
    },
    order_notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'orders',
    timestamps: false,
});

User.hasMany(Order, { foreignKey: 'uid' });
Product.hasMany(Order, { foreignKey: 'pid' });
DeliveryAddress.hasMany(Order, { foreignKey: 'shipping_address_id' });
Order.belongsTo(User, { foreignKey: 'uid' });
Order.belongsTo(Product, { foreignKey: 'pid' });
Order.belongsTo(DeliveryAddress, { foreignKey: 'shipping_address_id' });

module.exports = Order;
