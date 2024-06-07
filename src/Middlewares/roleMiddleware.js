

// const roleAuth = (roles) => {
//     return (req, res, next) => {
//         if (!roles.includes(req.user.role)) {
//             return res.status(403).json({
//                 status: 'failed',
//                 statusCode: 403,
//                 message: 'Authorization failed. You do not have permission to access this resource.'
//             });
//         }
//         next();
//     };
// };

// module.exports = roleAuth;
