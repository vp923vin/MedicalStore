const { DataTypes } = require('sequelize');
const sequelize = require('../Configs/db');
const User = require('./userModel');

const DeliveryOption = sequelize.define('DeliveryOption', {
    delivery_option_id: {
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
    option_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
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
    tableName: 'delivery_options',
    timestamps: false
});

// Associations
DeliveryOption.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(DeliveryOption, { foreignKey: 'user_id' });

module.exports = DeliveryOption;
