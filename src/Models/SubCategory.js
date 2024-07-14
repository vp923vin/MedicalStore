module.exports = (sequelize, DataTypes) => {
    const SubCategory = sequelize.define('SubCategory', {
        sub_category_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category_id: {
            type: DataTypes.INTEGER,
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
        tableName: 'sub_categories',
        timestamps: true,
        paranoid: true
    });

    SubCategory.associate = (models) => {
        SubCategory.belongsTo(models.Category, {
            foreignKey: 'category_id',
            onDelete: 'CASCADE'
        });
    };

    return SubCategory;
};
