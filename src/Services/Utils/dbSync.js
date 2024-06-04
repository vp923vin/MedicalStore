const sequelize = require('../../Configs/db');
const Role = require('../../Models/userRoleModel');
const Category = require('../../Models/categoryModel');
const User = require('../../Models/userModel');
const Product = require('../../Models/productModel');
const DeliveryOption = require('../../Models/deliveryOptionModel');
const Order = require('../../Models/orderModel');
const OrderItem = require('../../Models/orderItemModel');
const Payment = require('../../Models/paymentModel');
const Invoice = require('../../Models/invoiceModel');
const Inventory = require('../../Models/inventoryModel');
const OrderStatus = require('../../Models/orderStatusModel');
const Prescription = require('../../Models/prescriptionModel');
const PasswordReset = require('../../Models/passwordResetModel');

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
