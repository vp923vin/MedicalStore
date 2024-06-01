const express = require('express');

const adminRoutes = require('../Routes/admin');
const authRoutes = require('../Routes/auth');
const userRoutes = require('../Routes/user');

module.exports = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    app.use('/api/admin', adminRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api', userRoutes);
    
};