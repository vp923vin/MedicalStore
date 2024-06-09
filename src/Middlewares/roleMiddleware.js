const roleMiddleware = (requiredRole) => {
    return (req, res, next) => {
        const userRoleName = req.user.Role.role_name;

        if (userRoleName !== requiredRole) {
            return res.status(403).json({
                status: 'failed',
                statusCode: 403,
                message: 'Access denied',
                errors: [{ message: 'Access denied' }],
            });
        }

        next();
    };
};

module.exports = roleMiddleware;
