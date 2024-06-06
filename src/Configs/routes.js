const express = require('express');

const adminRoutes = require('../Routes/admin');
const authRoutes = require('../Routes/auth');
const userRoutes = require('../Routes/user');
const errorMiddleware  = require('../Middlewares/errorMiddleware');
const activityLogger = require('../Middlewares/activityMiddleware');
module.exports = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/api/admin', adminRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api', userRoutes);  
    // app.use(activityLogger);
    // app.use((req, res, next) => {
    //   const error = new Error(`Cannot find ${req.originalUrl}`);
    //   res.status(404);
    //   next(error);
    // });
    // app.use(errorMiddleware);
};