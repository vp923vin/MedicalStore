const express = require('express');

const {
    createRole,
    getRoleById,
    getRolesByPagination,
    updateRole,
    deleteRole,
    getTrashListRoles,
    permanentlyDeleteRole,
    multiDeleteRolePermanently
} = require('../Controllers/Admin/roleController');

const {
    createCategory,
    getCategories,
    getCategoriesById,
    updateCategory,
    deleteCategory,
} = require('../Controllers/Admin/categoryController');

const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} = require('../Controllers/Admin/productController');

const {
    createInventory,
    getInventorieById,
    updateInventory,
    deleteInventory,
    updateLastRestocked,
    updateLastSold
} = require('../Controllers/Admin/inventoryController');

const authMiddleware = require('../Middlewares/authMiddleware');
const roleMiddleware = require('../Middlewares/roleMiddleware');
const upload = require('../Services/Utils/imageUpload');
const validate = require('../Services/FormValidators/validationRules')
const router = express.Router();

router.get('/',
    (req, res) => {
        res.send("Hello, world!");
    });

// roles manage
router.post('/create-role', validate('role'), authMiddleware, roleMiddleware('admin'), createRole);
router.get('/single-role/:roleId', authMiddleware, roleMiddleware('admin'), getRoleById);
router.get('/roles', authMiddleware, roleMiddleware('admin'), getRolesByPagination);
router.put('/update-role/:roleId', validate('role'), authMiddleware, roleMiddleware('admin'), updateRole);
router.post('/delete-role/:roleId', authMiddleware, roleMiddleware('admin'), deleteRole); // timestamp
router.get('/roles/trash-list', getTrashListRoles);
router.delete('/roles/permanently-delete', permanentlyDeleteRole);
router.delete('/roles/permanently-multiple-delete', multiDeleteRolePermanently);

// users manage
router.get('/all-user', authMiddleware, roleMiddleware('admin'), listAllUsers);
router.get('/fetch-user/:userId', authMiddleware, roleMiddleware('admin'), getUserProfile);
router.put('/update-user/:userId', authMiddleware, roleMiddleware('admin'), updateUserProfile);
router.post('/delete-user/:userId', authMiddleware, roleMiddleware('admin'), deleteUserProfile);
router.get('/users/trash-list');
router.delete('/users/permanently-delete');

// product category manage
router.post('/create-category', validate('category'), authMiddleware, roleMiddleware('admin'), createCategory);
router.get('/all-category', authMiddleware, roleMiddleware('admin'), getCategories);
router.get('/single-category/:categoryId', authMiddleware, roleMiddleware('admin'), getCategoriesById);
router.put('/update-category/:categoryId', authMiddleware, roleMiddleware('admin'), updateCategory);
router.post('/delete-category/:categoryId', authMiddleware, roleMiddleware('admin'), deleteCategory);
router.get('/category/trash-list');
router.delete('/category/permanently-delete');

// products manage
router.post('/create-product', upload.single('product_image'), validate('product'), authMiddleware, roleMiddleware('admin'), createProduct);
router.get('/all-products', authMiddleware, roleMiddleware('admin'), getProducts);
router.get('/single-product/:productId', authMiddleware, roleMiddleware('admin'), getProductById);
router.put('/update-product/:productId', authMiddleware, roleMiddleware('admin'), updateProduct);
router.post('/delete-product/:productId', authMiddleware, roleMiddleware('admin'), deleteProduct);
router.get('/product/trash-list');
router.delete('/product/permanently-delete');

// products inventory manage
router.post('/create-inventory', upload.single('product_image'), validate('inventory'), authMiddleware, roleMiddleware('admin'), createInventory);
router.get('/inventory/:inventoryId', authMiddleware, roleMiddleware('admin'), getInventorieById);
router.put('/update-inventory/:inventoryId', validate('inventory'), authMiddleware, roleMiddleware('admin'), updateInventory);
router.put('/update-inventory/last-restocked/:inventoryId', authMiddleware, roleMiddleware('admin'), updateLastRestocked);
router.put('/update-inventory/last-sold-out/:inventoryId', authMiddleware, roleMiddleware('admin'), updateLastSold);
router.delete('/delete-inventory/:inventoryId', authMiddleware, roleMiddleware('admin'), deleteInventory);

//

module.exports = router;