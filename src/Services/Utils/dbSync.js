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
const OtpManager = require('../../Models/otpManager');
const bcrypt = require('bcrypt');


const predefinedRoles = [
    { role_name: 'admin' },
    { role_name: 'manager' },
    { role_name: 'customer' },
    { role_name: 'deliveryBoy' },
];


const insertRoles = async () => {
    try {
        await Role.sync({ alter: true });

        const existingRoles = await Role.findAll();
        if (existingRoles.length === 0) {
            await Role.bulkCreate(predefinedRoles);
            console.log('Predefined roles have been inserted.');
        } else {
            console.log('Roles already exist in the database.');
        }
    } catch (error) {
        console.error('Error inserting predefined roles:', error);
    }
};


const predefinedUsers = async () => {
    try {
        // Find roles by name
        const roles = await Role.findAll();
        const roleMap = {};
        roles.forEach(role => {
            roleMap[role.role_name] = role.role_id;
        });

        const users = [
            {
                username: 'adminUser',
                password: await bcrypt.hash('12345678', 10),
                email: 'admin@example.com',
                role_id: roleMap['admin']
            },
            {
                username: 'managerUser',
                password: await bcrypt.hash('12345678', 10),
                email: 'manager@example.com',
                role_id: roleMap['manager']
            },
            {
                username: 'customerUser',
                password: await bcrypt.hash('12345678', 10),
                email: 'customer@example.com',
                role_id: roleMap['customer']
            },
            {
                username: 'deliveryBoyUser',
                password: await bcrypt.hash('12345678', 10),
                email: 'deliveryBoy@example.com',
                role_id: roleMap['deliveryBoy']
            }
        ];

        // Check if users already exist
        const existingUsers = await User.findAll();
        if (existingUsers.length === 0) {
            // Insert predefined users if they do not exist
            await User.bulkCreate(users);
            console.log('Predefined users have been inserted.');
        } else {
            console.log('Users already exist in the database.');
        }
    } catch (error) {
        console.error('Error inserting predefined users:', error);
    }
};




const initializeDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await sequelize.sync({ force: false }); // Use 'force: true' to drop and re-create tables
        await insertRoles();
        await predefinedUsers();
        console.log('Database synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = initializeDatabase;
