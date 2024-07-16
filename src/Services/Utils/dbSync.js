const bcrypt = require("bcrypt");
const sequelize = require("../../Configs/db");
const db = require("../../Models/index");

// define associations

const defineAssociations = async () => {
  try {
    // User Associations
    db.User.belongsTo(db.Role, { foreignKey: "role_id" });
    db.User.hasMany(db.Wishlist, { foreignKey: "user_id" });
    db.User.hasMany(db.Order, { foreignKey: "user_id" });
    db.User.hasMany(db.UserDeliveryAddress, { foreignKey: "user_id" });
    db.User.hasMany(db.SupportHelp, { foreignKey: "user_id" });
    db.User.hasMany(db.PasswordReset, { foreignKey: "user_id" });
    db.User.hasMany(db.OTPManager, { foreignKey: "user_id" });
    db.User.belongsToMany(db.Role, {
      through: db.UserPermission,
      foreignKey: "user_id",
    });

    // Role Associations
    db.Role.hasMany(db.User, { foreignKey: "role_id" });
    db.Role.belongsToMany(db.User, {
      through: db.UserPermission,
      foreignKey: "role_id",
    });

    // Product Associations
    db.Product.belongsTo(db.Category, { foreignKey: "category_id" });
    db.Product.belongsTo(db.SubCategory, { foreignKey: "sub_category_id" });
    db.Product.hasOne(db.Inventory, { foreignKey: "product_id" });
    db.Product.hasMany(db.Checkout, { foreignKey: "product_id" });
    db.Product.hasMany(db.OrderItem, { foreignKey: "product_id" });

    // Order Associations
    db.Order.belongsTo(db.User, { foreignKey: "user_id" });
    db.Order.belongsTo(db.OrderShipping, { foreignKey: "shipping_id" }); // One-to-One
    db.Order.belongsTo(db.Payment, { foreignKey: "payment_id" });
    // Optional: Consider adding a belongsTo association with OrderStatus model (if it exists)
    db.Order.hasMany(db.OrderItem, { foreignKey: "order_id" });
    db.Order.hasOne(db.Invoice, { foreignKey: "order_id" });

    // OrderShipping Associations
    db.OrderShipping.belongsTo(db.UserDeliveryAddress, {
      foreignKey: "user_delivery_address_id",
    });

    // Wishlist Associations
    db.Wishlist.belongsTo(db.User, { foreignKey: "user_id" });
    db.Wishlist.belongsTo(db.Product, { foreignKey: "product_id" });

    // Checkout Associations
    db.Checkout.belongsTo(db.User, { foreignKey: "user_id" });
    db.Checkout.belongsTo(db.Product, { foreignKey: "product_id" });

    // Invoice Associations
    db.Invoice.belongsTo(db.Order, { foreignKey: "order_id" });

    // OrderItem Associations
    db.OrderItem.belongsTo(db.Order, { foreignKey: "order_id" });
    db.OrderItem.belongsTo(db.Product, { foreignKey: "product_id" });

    // Prescription Associations
    db.Prescription.belongsTo(db.User, { foreignKey: "user_id" });
    db.Prescription.belongsTo(db.Order, { foreignKey: "order_id" }); // Optional association

    // PasswordReset Associations
    db.PasswordReset.belongsTo(db.User, { foreignKey: "user_id" });

    // OTPManager Associations
    db.OTPManager.belongsTo(db.User, { foreignKey: "user_id" });

    // UserPermission Associations
    db.UserPermission.belongsTo(db.User, { foreignKey: "user_id" });
    db.UserPermission.belongsTo(db.Role, { foreignKey: "role_id" });

    // SupportHelp Associations
    db.SupportHelp.belongsTo(db.User, { foreignKey: "user_id" });
    db.SupportHelp.hasMany(db.SupportHelpMessages, {
      foreignKey: "support_help_id",
    });

    // SupportHelpMessages Associations
    db.SupportHelpMessages.belongsTo(db.SupportHelp, {
      foreignKey: "support_help_id",
    });

    // OrderTracking Associations (Optional - Consider adding a foreign key to Order)
    // db.OrderTracking.belongsTo(db.Order, { foreignKey: 'order_id' });

    console.log("Associations defined successfully.");
  } catch (error) {
    console.error("Error defining associations:", error);
  }
};

const predefinedRoles = [
  { role_name: "admin" },
  { role_name: "manager" },
  { role_name: "customer" },
  { role_name: "deliveryBoy" },
];

const insertRoles = async () => {
  try {
    await db.Role.sync({ alter: true });

    const existingRoles = await db.Role.findAll();
    if (existingRoles.length === 0) {
      await db.Role.bulkCreate(predefinedRoles);
      console.log("Predefined roles have been inserted.");
    } else {
      console.log("Roles already exist in the database.");
    }
  } catch (error) {
    console.error("Error inserting predefined roles:", error);
  }
};

const predefinedUsers = async () => {
  try {
    // Find roles by name
    const roles = await db.Role.findAll();
    const roleMap = {};
    roles.forEach((role) => {
      roleMap[role.role_name] = role.role_id;
    });

    const users = [
      {
        fullname: "Administrator",
        username: "adminUser",
        password: await bcrypt.hash("12345678", 10),
        email: "admin@gmail.com",
        phone: "1234567898",
        role_id: roleMap["admin"],
      },
      {
        fullname: "Manager",
        username: "managerUser",
        password: await bcrypt.hash("12345678", 10),
        email: "manager@gmail.com",
        phone: "1234576898",
        role_id: roleMap["manager"],
      },
      {
        fullname: "Customer Jhon",
        username: "customerUser",
        password: await bcrypt.hash("12345678", 10),
        email: "customer@gmail.com",
        phone: "1234567988",
        role_id: roleMap["customer"],
      },
      {
        fullname: "Delivery Boy",
        username: "deliveryBoyUser",
        password: await bcrypt.hash("12345678", 10),
        email: "deliveryBoy@gmail.com",
        phone: "1234568798",
        role_id: roleMap["deliveryBoy"],
      },
    ];

    // Check if users already exist
    const existingUsers = await db.User.findAll();
    if (existingUsers.length === 0) {
      // Insert predefined users if they do not exist
      await db.User.bulkCreate(users);
      console.log("Predefined users have been inserted.");
    } else {
      console.log("Users already exist in the database.");
    }
  } catch (error) {
    console.error("Error inserting predefined users:", error);
  }
};

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await sequelize.sync({ force: false }); // Use 'force: true' to drop and re-create tables
    await defineAssociations();
    await insertRoles();
    await predefinedUsers();
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = initializeDatabase;