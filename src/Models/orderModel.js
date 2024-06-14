const { DataTypes } = require('sequelize');
const sequelize = require('../Configs/db');
const User = require('./userModel');
const DeliveryOption = require('./deliveryOptionModel');
const OrderStatus = require('./orderStatusModel');

const Order = sequelize.define('Order', {
    order_id: {
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
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    order_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    status_id: {
        type: DataTypes.STRING,
        references: {
            model: 'order_status',
            key: 'status_id'
        },
    },
    delivery_option_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'delivery_options',
            key: 'delivery_option_id'
        }
    },
    shipping_address: {
        type: DataTypes.TEXT,
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
    tableName: 'orders',
    timestamps: false
});

// Associations
Order.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Order, { foreignKey: 'user_id' });

// Order.belongsTo(OrderStatus, { foreignKey: 'status_id' });
// OrderStatus.hasMany(Order, { foreignKey: 'status_id' });

Order.belongsTo(DeliveryOption, { foreignKey: 'delivery_option_id' });
DeliveryOption.hasMany(Order, { foreignKey: 'delivery_option_id' });

module.exports = Order;
