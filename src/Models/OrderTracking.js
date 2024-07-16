module.exports = (sequelize, DataTypes) => {
    const OrderTracking = sequelize.define('OrderTracking', {
        tracking_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        // order_id: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false
        // },
        tracking_details: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        list_details: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'created_at'
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'updated_at'
        },
        deletedAt: {
            type: DataTypes.DATE,
            field: 'deleted_at'
        }
    }, {
        tableName: 'order_tracking',
        timestamps: true,
        paranoid: true
    });

    return OrderTracking;
};
