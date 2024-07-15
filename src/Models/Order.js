module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    order_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    shipping_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tracking_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    order_status: {
      type: DataTypes.ENUM('paid', 'unpaid'),
      allowNull: false
    },
    total_amount: {
      type: DataTypes.FLOAT,
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
    tableName: 'orders',
    timestamps: true,
    paranoid: true
  });

  return Order;
};
