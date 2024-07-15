module.exports = (sequelize, DataTypes) => {
  const Prescription = sequelize.define('Prescription', {
    prescription_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    // user_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false
    // },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    prescription_image_url: {
      type: DataTypes.STRING,
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
    tableName: 'prescriptions',
    timestamps: true,
    paranoid: true
  });

  return Prescription;
};
