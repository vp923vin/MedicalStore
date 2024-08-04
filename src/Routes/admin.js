const express = require('express');

const {
    createRole,
    getRoleById,
    getRolesByPagination,
    updateRole,
    deleteRole,
    getTrashListRoles,
    permanentlyDeleteRole,
    multiDeleteRolePermanently,
    restoreRoleById,
    bulkRestoreRoles,
    searchRoles,
} = require('../Controllers/Admin/roleController');

const  {
    createCategory,
    getCategoryById,
    getCategoriesByPagination,
    updateCategory,
    deleteCategory,
    getTrashListCategories,
    permanentlyDeleteCategoryById,
    multiDeleteCategoriesPermanently,
    restoreCategory,
    searchCategories,
    getCategoriesWithSubCategories,
} = require('../Controllers/Admin/categoryController');

const {
    createSubCategory,
    getSubCategoryById,
    getSubCategoriesByPagination,
    updateSubCategory,
    deleteSubCategory,
    getTrashListSubCategories,
    permanentlyDeleteSubCategoryById,
    multiDeleteSubCategoriesPermanently,
    restoreSubCategory,
    searchSubCategories,
} = require('../Controllers/Admin/subCategoryController');

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
router.get('/roles/trash-list', authMiddleware, roleMiddleware('admin'), getTrashListRoles);
router.delete('/roles/permanently-delete', authMiddleware, roleMiddleware('admin'), permanentlyDeleteRole);
router.delete('/roles/permanently-multiple-delete', authMiddleware, roleMiddleware('admin'), multiDeleteRolePermanently);
router.get('/roles/restore-role/:roleId',  authMiddleware, roleMiddleware('admin'), restoreRoleById);
router.get('/roles/restore-bulk',  authMiddleware, roleMiddleware('admin'), bulkRestoreRoles);
router.get('/roles/search', authMiddleware, roleMiddleware('admin'), searchRoles);

// users manage
router.get('/all-user', authMiddleware, roleMiddleware('admin'), listAllUsers);
router.get('/fetch-user/:userId', authMiddleware, roleMiddleware('admin'), getUserProfile);
router.put('/update-user/:userId', authMiddleware, roleMiddleware('admin'), updateUserProfile);
router.post('/delete-user/:userId', authMiddleware, roleMiddleware('admin'), deleteUserProfile);
router.get('/users/trash-list');
router.delete('/users/permanently-delete');

// product category manage
router.post('/create-category', validate('category'), authMiddleware, roleMiddleware('admin'), createCategory);
router.get('/categories', authMiddleware, roleMiddleware('admin'), getCategoriesByPagination);
router.get('/single-category/:categoryId', authMiddleware, roleMiddleware('admin'), getCategoryById);
router.put('/update-category/:categoryId', authMiddleware, roleMiddleware('admin'), updateCategory);
router.post('/delete-category/:categoryId', authMiddleware, roleMiddleware('admin'), deleteCategory);
router.get('/categories/trash-list', authMiddleware, roleMiddleware('admin'), getTrashListCategories);
router.delete('/categories/permanently-delete', authMiddleware, roleMiddleware('admin'), permanentlyDeleteCategoryById);
router.delete('/categories/permanently-multiple-delete', authMiddleware, roleMiddleware('admin'), multiDeleteCategoriesPermanently);
router.get('/categories/restore-category', authMiddleware, roleMiddleware('admin'), restoreCategory);
router.get('/categories/search', authMiddleware, roleMiddleware('admin'), searchCategories);
router.get('/categories/get-category-subcategory/all',authMiddleware, roleMiddleware('admin'), getCategoriesWithSubCategories);

// subcategory manages
router.post('/create-sub-category', validate('category'), authMiddleware, roleMiddleware('admin'), createSubCategory);
router.get('/sub-categories', authMiddleware, roleMiddleware('admin'), getSubCategoriesByPagination);
router.get('/single-sub-category/:categoryId', authMiddleware, roleMiddleware('admin'), getSubCategoryById);
router.put('/update-sub-category/:categoryId', authMiddleware, roleMiddleware('admin'), updateSubCategory);
router.post('/delete-sub-category/:categoryId', authMiddleware, roleMiddleware('admin'), deleteSubCategory);
router.get('/sub-categories/trash-list', authMiddleware, roleMiddleware('admin'), getTrashListSubCategories);
router.delete('/sub-categories/permanently-delete', authMiddleware, roleMiddleware('admin'), permanentlyDeleteSubCategoryById);
router.delete('/sub-categories/permanently-multiple-delete', authMiddleware, roleMiddleware('admin'), multiDeleteSubCategoriesPermanently);
router.get('/sub-categories/restore-sub-category', authMiddleware, roleMiddleware('admin'), restoreSubCategory);
router.get('/sub-categories/search', authMiddleware, roleMiddleware('admin'), searchSubCategories);


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



module.exports = router;