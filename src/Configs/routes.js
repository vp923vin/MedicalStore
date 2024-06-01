const express = require('express');

const adminRoutes = require('../Routes/admin');
const authRoutes = require('../Routes/auth');
const userRoutes = require('../Routes/user');
const errorMiddleware  = require('../Middlewares/errorMiddleware');
module.exports = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    app.use('/api/admin', errorMiddleware,  adminRoutes);
    app.use('/api/auth', errorMiddleware,  authRoutes);
    app.use('/api', errorMiddleware,  userRoutes);

};