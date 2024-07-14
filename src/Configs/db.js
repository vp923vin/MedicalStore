require('dotenv').config();
const { Sequelize } = require('sequelize');

const dbConfigs = {
   host: process.env.DB_HOST, 
   connection: process.env.DB_CONNECTION, 
   database: process.env.DB_NAME, 
   username: process.env.DB_USER, 
   password: process.env.DB_PASSWORD
};

const sequelize = new Sequelize(dbConfigs.database, dbConfigs.username, dbConfigs.password, {
  host: dbConfigs.host,
  dialect: dbConfigs.connection,
});

module.exports = sequelize;
