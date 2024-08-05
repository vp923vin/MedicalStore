module.exports = (sequelize, DataTypes) => {
  const Inventory = sequelize.define('Inventory', {
    inventory_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    available_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stock_status: {
      type: DataTypes.ENUM('In', 'Out'),
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
    tableName: 'inventory',
    timestamps: true,
    paranoid: true
  });

  return Inventory;
};
