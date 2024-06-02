const { DataTypes } = require('sequelize');
const sequelize = require('../Configs/db');
const Order = require('./orderModel');
const DeliveryAddress = require('./deliveryAddressModel');

const Invoice = sequelize.define('Invoice', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    oid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Order,
            key: 'id',
        },
    },
    invoice: {
        type: DataTypes.TEXT,
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
    invoice_number: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
    },
    billing_address_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: DeliveryAddress,
            key: 'id',
        },
    },
}, {
    tableName: 'invoices',
    timestamps: false,
});

Order.hasOne(Invoice, { foreignKey: 'oid' });
Invoice.belongsTo(Order, { foreignKey: 'oid' });
DeliveryAddress.hasMany(Invoice, { foreignKey: 'billing_address_id' });
Invoice.belongsTo(DeliveryAddress, { foreignKey: 'billing_address_id' });

module.exports = Invoice;
