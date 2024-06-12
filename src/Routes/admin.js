const express = require('express');

const { roleValidationRules } = require('../Services/FormValidators/roleValidation');
const { categoryValidatorRules } = require('../Services/FormValidators/customValidation');
const { productValidationRules } = require('../Services/FormValidators/productValidation');
const { 
    createRole, 
    getRoles,
    getRoleById, 
    updateRole, 
    deleteRole, 
    listAllUsers,
    getUserProfile, 
    updateUserProfile, 
    deleteUserProfile 
} = require('../Controllers/adminController');

const {
    createCategory,
    getCategories,
    getCategoriesById,
    updateCategory,
    deleteCategory,
} = require('../Controllers/categoryController');

const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} = require('../Controllers/productController');

const authMiddleware = require('../Middlewares/authMiddleware');
const roleMiddleware = require('../Middlewares/roleMiddleware');
const upload = require('../Services/Utils/imageUpload');

const router = express.Router();

router.get('/', 
(req, res) => {
    res.send("Hello, world!");
});

// roles
router.post('/create-role', roleValidationRules(), authMiddleware, roleMiddleware('admin'), createRole);
router.get('/all-roles', authMiddleware, roleMiddleware('admin'), getRoles);
router.get('/single-role/:roleId', authMiddleware, roleMiddleware('admin'), getRoleById);
router.put('/update-role/:roleId', roleValidationRules(), authMiddleware, roleMiddleware('admin'), updateRole);
router.delete('/delete-role/:roleId', authMiddleware, roleMiddleware('admin'), deleteRole);

// users
router.get('/all-user', authMiddleware, roleMiddleware('admin'), listAllUsers);
router.get('/fetch-user/:userId', authMiddleware, roleMiddleware('admin'),  getUserProfile);
router.put('/update-user/:userId', authMiddleware, roleMiddleware('admin'), updateUserProfile);
router.delete('/delete-user/:userId', authMiddleware, roleMiddleware('admin'), deleteUserProfile);

// product category
router.post('/create-category', categoryValidatorRules(), authMiddleware, roleMiddleware('admin'), createCategory);
router.get('/all-category', authMiddleware, roleMiddleware('admin'), getCategories);
router.get('/single-category/:categoryId', authMiddleware, roleMiddleware('admin'), getCategoriesById);
router.put('/update-category/:categoryId', authMiddleware, roleMiddleware('admin'), updateCategory);
router.delete('/delete-category/:categoryId', authMiddleware, roleMiddleware('admin'), deleteCategory);

// products
router.post('/create-product', upload.single('product_image'), productValidationRules(), authMiddleware, roleMiddleware('admin'), createProduct); 
router.get('/all-products', authMiddleware, roleMiddleware('admin'), getProducts);  
router.get('/single-product/:productId', authMiddleware, roleMiddleware('admin'), getProductById);  
router.put('/update-product/:productId', authMiddleware, roleMiddleware('admin'), updateProduct);  
router.delete('/delete-product/:productId', authMiddleware, roleMiddleware('admin'), deleteProduct);  

module.exports = router;