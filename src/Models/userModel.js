const { DataTypes } = require('sequelize');
const sequelize = require('../Configs/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    mobile: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    access_token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email_verified_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    role: {
        type: DataTypes.ENUM('admin', 'customer'),
        allowNull: false,
        defaultValue: 'customer',
    },
    last_login: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'banned'),
        allowNull: false,
        defaultValue: 'active',
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
    tableName: 'users',
    timestamps: false,
});

module.exports = User;
