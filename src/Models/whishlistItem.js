// const { DataTypes } = require('sequelize');
// const sequelize = require('../Configs/db');
// const User = require('./userModel');
// const Product = require('./productModel');

// const Wishlist = sequelize.define('Wishlist', {
//     wishlist_id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     user_id: {
//         type: DataTypes.INTEGER,
//         references: {
//             model: 'users',
//             key: 'user_id'
//         }
//     },
//     product_id: {
//         type: DataTypes.INTEGER,
//         references: {
//             model: 'products',
//             key: 'product_id'
//         }
//     },
//     created_at: {
//         type: DataTypes.DATE,
//         defaultValue: DataTypes.NOW
//     }
// }, {
//     tableName: 'wishlist',
//     timestamps: false
// });

// // Associations
// Wishlist.belongsTo(User, { foreignKey: 'user_id' });
// User.hasMany(Wishlist, { foreignKey: 'user_id' });

// Wishlist.belongsTo(Product, { foreignKey: 'product_id' });
// Product.hasMany(Wishlist, { foreignKey: 'product_id' });

// module.exports = Wishlist;
