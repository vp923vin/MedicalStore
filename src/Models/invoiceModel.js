const { DataTypes } = require('sequelize');
const sequelize = require('../Configs/db');
const Order = require('./orderModel');

const Invoice = sequelize.define('Invoice', {
    invoice_id: {
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
    invoice_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    billing_address: {
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
    tableName: 'invoices',
    timestamps: false
});

// Associations
Invoice.belongsTo(Order, { foreignKey: 'order_id' });
Order.hasMany(Invoice, { foreignKey: 'order_id' });

module.exports = Invoice;
