module.exports = (sequelize, DataTypes) => {
  const OrderShipping = sequelize.define('OrderShipping', {
    shipping_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    checkout_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_delivery_address_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    shipping_date: {
      type: DataTypes.DATE,
      allowNull: true
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
    tableName: 'order_shipping',
    timestamps: true,
    paranoid: true
  });

  return OrderShipping;
};
