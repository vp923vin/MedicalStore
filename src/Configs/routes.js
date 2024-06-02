const express = require('express');

const adminRoutes = require('../Routes/admin');
const authRoutes = require('../Routes/auth');
const userRoutes = require('../Routes/user');
const errorMiddleware  = require('../Middlewares/errorMiddleware');

module.exports = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/api/admin', adminRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api', userRoutes);
    // app.use((req, res, next) => {
    //     console.log(next)
    //     const error = new Error('This is a test error');
    //     error.status = 500;
    //     next(error);
    // });
    app.use((req, res, next) => {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
    app.use(errorMiddleware);
};