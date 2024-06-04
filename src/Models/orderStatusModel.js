const { DataTypes } = require('sequelize');
const sequelize = require('../Configs/db');
const Order = require('./orderModel');
const User = require('./userModel');

const OrderStatus = sequelize.define('OrderStatus', {
    status_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'orders',
            key: 'order_id'
        }
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    order_cancel_reason: {
        type: DataTypes.STRING,
        allowNull: true
    },
    updated_by: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'user_id'
        }
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'order_status',
    timestamps: false
});

// Associations
OrderStatus.belongsTo(Order, { foreignKey: 'order_id' });
Order.hasMany(OrderStatus, { foreignKey: 'order_id' });

OrderStatus.belongsTo(User, { foreignKey: 'updated_by' });
User.hasMany(OrderStatus, { foreignKey: 'updated_by' });

module.exports = OrderStatus;
