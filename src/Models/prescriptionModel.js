const { DataTypes } = require('sequelize');
const sequelize = require('../Configs/db');
const User = require('./userModel');
const Product = require('./productModel');

const Prescription = sequelize.define('Prescription', {
    prescription_id: {
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
    product_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'products',
            key: 'product_id'
        }
    },
    doctor_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    prescription_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    prescription_image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    notes: {
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
    tableName: 'prescriptions',
    timestamps: false
});

// Associations
Prescription.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Prescription, { foreignKey: 'user_id' });

Prescription.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(Prescription, { foreignKey: 'product_id' });

module.exports = Prescription;
