const { DataTypes } = require('sequelize');
const sequelize = require('../Configs/db');
const User = require('./userModel');

const PasswordReset = sequelize.define('PasswordReset', {
    reset_id: {
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
    reset_token: {
        type: DataTypes.STRING,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'password_resets',
    timestamps: false
});

// Associations
PasswordReset.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(PasswordReset, { foreignKey: 'user_id' });

module.exports = PasswordReset;
