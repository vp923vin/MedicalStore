const bcrypt = require("bcrypt");
const sequelize = require("../../Configs/db");
const {
  Sequelize,
  User,
  Role,
  Product,
  Category,
  SubCategory,
  Order,
  Payment,
  Inventory,
  OrderShipping,
  Wishlist,
  Checkout,
  Invoice,
  // OrderItem,
  Prescription,
  PasswordReset,
  OTPManager,
  UserPermission,
  SupportHelp,
  SupportHelpMessages,
  UserDeliveryAddress,
  OrderTracking
} = require("../../Models/Index");

// define associations
const defineAssociations = () => {
  try {
    // User associations
  User.belongsTo(Role, { foreignKey: 'role_id' });
  Role.hasMany(User, { foreignKey: 'role_id' });

  // Product associations
  Product.belongsTo(Category, { foreignKey: 'category_id' });
  Category.hasMany(Product, { foreignKey: 'category_id' });

  Product.belongsTo(SubCategory, { foreignKey: 'sub_category_id' });
  SubCategory.hasMany(Product, { foreignKey: 'sub_category_id' });

  Product.hasOne(Inventory, { foreignKey: 'product_id' });
  Inventory.belongsTo(Product, { foreignKey: 'product_id' });

  // Order associations
  Order.belongsTo(User, { foreignKey: 'user_id' });
  User.hasMany(Order, { foreignKey: 'user_id' });

  Order.hasMany(Payment, { foreignKey: 'order_id' });
  Payment.belongsTo(Order, { foreignKey: 'order_id' });

  Order.hasOne(OrderShipping, { foreignKey: 'order_id' });
  OrderShipping.belongsTo(Order, { foreignKey: 'order_id' });

  Order.hasOne(OrderTracking, { foreignKey: 'order_id' });
  OrderTracking.belongsTo(Order, { foreignKey: 'order_id' });

  Order.hasOne(Prescription, { foreignKey: 'order_id' });
  Prescription.belongsTo(Order, { foreignKey: 'order_id' });

  Order.hasOne(Invoice, { foreignKey: 'order_id' });
  Invoice.belongsTo(Order, { foreignKey: 'order_id' });

  // Wishlist associations
  Wishlist.belongsTo(User, { foreignKey: 'user_id' });
  User.hasMany(Wishlist, { foreignKey: 'user_id' });

  Wishlist.belongsTo(Product, { foreignKey: 'product_id' });
  Product.hasMany(Wishlist, { foreignKey: 'product_id' });

  // Checkout associations
  Checkout.belongsTo(User, { foreignKey: 'user_id' });
  User.hasMany(Checkout, { foreignKey: 'user_id' });

  Checkout.belongsTo(Product, { foreignKey: 'product_id' });
  Product.hasMany(Checkout, { foreignKey: 'product_id' });

  // PasswordReset associations
  PasswordReset.belongsTo(User, { foreignKey: 'user_id' });
  User.hasMany(PasswordReset, { foreignKey: 'user_id' });

  // OTPManager associations
  OTPManager.belongsTo(User, { foreignKey: 'user_id' });
  User.hasMany(OTPManager, { foreignKey: 'user_id' });

  // UserPermission associations
  UserPermission.belongsTo(User, { foreignKey: 'user_id' });
  User.hasMany(UserPermission, { foreignKey: 'user_id' });

  // SupportHelp associations
  SupportHelp.belongsTo(User, { foreignKey: 'user_id' });
  User.hasMany(SupportHelp, { foreignKey: 'user_id' });

  SupportHelp.hasMany(SupportHelpMessages, { foreignKey: 'support_help_id' });
  SupportHelpMessages.belongsTo(SupportHelp, { foreignKey: 'support_help_id' });

  // UserDeliveryAddress associations
  UserDeliveryAddress.belongsTo(User, { foreignKey: 'user_id' });
  User.hasMany(UserDeliveryAddress, { foreignKey: 'user_id' });

    console.log("Associations defined successfully.");
  } catch (error) {
    console.log("Unable to create association");
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
    await Role.sync({ alter: true });

    const existingRoles = await Role.findAll();
    if (existingRoles.length === 0) {
      await Role.bulkCreate(predefinedRoles);
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
    const roles = await Role.findAll();
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
    const existingUsers = await User.findAll();
    if (existingUsers.length === 0) {
      // Insert predefined users if they do not exist
      await User.bulkCreate(users);
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