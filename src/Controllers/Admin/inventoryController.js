const { Inventory, Product } = require('../../Models/Index');

const createOrUpdateInventory = async (req, res) => {
    const { product_id, available_quantity, stock_status } = req.body;
    try {
        const existingInventory = await Inventory.findOne({ where: { product_id } });
        
        if (existingInventory) {
            existingInventory.available_quantity = available_quantity;
            existingInventory.stock_status = stock_status;
            await existingInventory.save();
            return res.status(200).json({
                status: 'success',
                statusCode: 200,
                message: 'Inventory record updated successfully',
                data: { inventory: existingInventory },
            });
        } else {
            const inventory = await Inventory.create({ product_id, available_quantity, stock_status });
            return res.status(201).json({
                status: 'success',
                statusCode: 201,
                message: 'Inventory record created successfully',
                data: { inventory: inventory },
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong in server.',
            error: error.message
        });
    }
};

const getInventorieById = async (req, res) => {
    const { inventoryId } = req.params;
    try {
        const inventory = await Inventory.findOne({ where: { inventory_id: inventoryId } });
        if (!inventory) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'Inventoy record not found',
                errors: [{message: 'Inventoy record not found'}]
            });
        }
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Inventories fetched successfully',
            data: { invetories: inventory },
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong in server.',
            error: error.message
        });
    }
};

const updateInventory = async (req, res) => {
    const { inventoryId } = req.params;
    const { product_id, available_quantity, stock_status } = req.body;
    try {
        const inventory = await Inventory.findByPk(inventoryId);
        if (!inventory) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'Inventory record not found',
                errors: [{ message: 'Inventory record not found' }]
            });
        }
        inventory.product_id = !(product_id) ? product_id : null;
        inventory.available_quantity = available_quantity;
        inventory.stock_status = stock_status;
        await inventory.save();
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Inventory record updated successfully',
            data: { inventory: inventory },
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong in server.',
            error: error.message
        });
    }
};

const tempDeleteInventory = async (req, res) => {
    const { inventoryId } = req.params;
    try {
        const inventory = await Inventory.findByPk(inventoryId);
        if (!inventory) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'Inventory record not found',
            });
        }
        inventory.deletedAt = Date.now();
        await inventory.save();
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Inventory record moved to trash successfully',
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong in server.',
            error: error.message
        });
    }
};

const updateStockStatus = async (req, res) => {
    const { inventoryId } = req.params;
    try {
        const inventory = await Inventory.findByPk(inventoryId);
        if (!inventory) {
            return res.status(404).json({
                status: 'failed',
                statusCode: 404,
                message: 'Inventory not found',
                errors: [{ message: 'Inventory not found' }]
            });
        }

        if(inventory.available_quantity <= 0) {
            inventory.stock_status = 'Out';
        }else{
            inventory.stock_status = 'In';
        }
        inventory.updatedAt = new Date();
        await inventory.save();

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Last restocked date updated successfully',
            data: { inventory: inventory },
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong in server.',
            error: error.message
        });
    }
};

const getInventoryByPagination = async (req, res) => {
    const { page = 1, pageSize = 10 } = req.query;
    const offset = (page - 1) * pageSize;
    const limit = parseInt(pageSize);

    try {
        const inventories = await Inventory.findAndCountAll({
            offset: offset,
            limit: limit,
        });

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            data: {
                totalItems: inventories.count,
                totalPages: Math.ceil(inventories.count / limit),
                currentPage: parseInt(page),
                inventories: inventories.rows,
            },
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong on the server.',
            error: error.message,
        });
    }
};

const tempBulkDeleteInventory = async (req, res) => {
    const { ids } = req.body; // Array of inventory IDs to be soft deleted

    try {
        await Inventory.update(
            { deletedAt: new Date() }, // Soft delete
            { where: { id: ids } }
        );

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Inventory records temporarily deleted successfully.',
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong on the server.',
            error: error.message,
        });
    }
};

const permanentDeleteInventoryById = async (req, res) => {
    const { id } = req.params;

    try {
        await Inventory.destroy({
            where: { id: id },
        });

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Inventory record permanently deleted successfully.',
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong on the server.',
            error: error.message,
        });
    }
};

const permanentMultiDeleteInventory = async (req, res) => {
    const { ids } = req.body; // Array of inventory IDs to be permanently deleted

    try {
        await Inventory.destroy({
            where: { id: ids },
        });

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Inventory records permanently deleted successfully.',
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong on the server.',
            error: error.message,
        });
    }
};

const restoreInventory = async (req, res) => {
    const { id } = req.params;

    try {
        await Inventory.update(
            { deletedAt: null }, // Restore
            { where: { id: id } }
        );

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Inventory record restored successfully.',
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong on the server.',
            error: error.message,
        });
    }
};

const restoreMultipleInventory = async (req, res) => {
    const { ids } = req.body; // Array of inventory IDs to be restored

    try {
        await Inventory.update(
            { deletedAt: null }, // Restore
            { where: { id: ids } }
        );

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Inventory records restored successfully.',
        });
    } catch (error) {
        return res.status(500).json({
            status: 'failed',
            statusCode: 500,
            message: 'Something went wrong on the server.',
            error: error.message,
        });
    }
};

module.exports = {
    createOrUpdateInventory,
    getInventorieById,
    updateInventory,
    tempDeleteInventory,
    updateStockStatus,
    getInventoryByPagination,
    tempBulkDeleteInventory,
    permanentDeleteInventoryById,
    permanentMultiDeleteInventory,
    restoreInventory,
    restoreMultipleInventory
};
