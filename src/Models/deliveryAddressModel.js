const { DataTypes } = require('sequelize');
const sequelize = require('../Configs/db');
const User = require('./userModel');

const DeliveryAddress = sequelize.define('DeliveryAddress', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    pincode: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    state: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    is_default: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    landmark: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    address_type: {
        type: DataTypes.ENUM('residential', 'commercial', 'other'),
        defaultValue: 'residential',
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
    tableName: 'delivery_addresses',
    timestamps: false,
});

User.hasMany(DeliveryAddress, { foreignKey: 'uid' });
DeliveryAddress.belongsTo(User, { foreignKey: 'uid' });

module.exports = DeliveryAddress;
