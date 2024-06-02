const sequelize = require('../../Configs/db');
const User = require('../../Models/userModel');
const DeliveryAddress = require('../../Models/deliveryAddressModel');
const Category = require('../../Models/categoryModel');
const Product = require('../../Models/productModel');
const Order = require('../../Models/orderModel');
const Invoice = require('../../Models/invoiceModel');

const initializeDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await sequelize.sync({ force: false }); // Use 'force: true' to drop and re-create tables
        console.log('Database synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = initializeDatabase;
