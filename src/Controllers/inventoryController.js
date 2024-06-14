const { validationResult } = require('express-validator');
const Inventory = require('../Models/inventoryModel');
const Product = require('../Models/productModel');
const formatErrors = require('../Services/Utils/formErrorFormat');

const createInventory = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = formatErrors(errors.array());
        return res.status(400).json({
            status: 'failed',
            statusCode: 400,
            message: "Validation Failed",
            errors: formattedErrors,
        });
    }

    const { product_id, quantity, min_quantity, max_quantity, warehouse_location } = req.body;

    try {
        const inventory = await Inventory.create({ product_id, quantity, min_quantity, max_quantity, warehouse_location });
        return res.status(201).json({
            status: 'success',
            statusCode: 201,
            message: 'Inventory record created successfully',
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

const getInventorieById = async (req, res) => {
    const { inventoryId } = req.params;
    try {
        const inventory = await Inventory.findOne({
            where: { inventory_id: inventoryId },
            include: [{ model: Product, as: 'product' }],
        });
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = formatErrors(errors.array());
        return res.status(400).json({
            status: 'failed',
            statusCode: 400,
            message: "Validation Failed",
            errors: formattedErrors,
        });
    }
    const { inventoryId } = req.params;
    const { quantity, min_quantity, max_quantity, warehouse_location } = req.body;
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
        inventory.quantity = quantity;
        inventory.min_quantity = min_quantity;
        inventory.max_quantity = max_quantity;
        inventory.warehouse_location = warehouse_location;
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

const deleteInventory = async (req, res) => {
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
        await inventory.destroy();
        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Inventory record deleted successfully',
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

const updateLastRestocked = async (req, res) => {
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

        inventory.last_restocked = new Date();
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

const updateLastSold = async (req, res) => {
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

        inventory.last_sold =new Date();
        await inventory.save();

        return res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Last sold date updated successfully',
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

module.exports = {
    createInventory,
    getInventorieById,
    updateInventory,
    deleteInventory,
    updateLastRestocked,
    updateLastSold
};
