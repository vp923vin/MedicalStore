module.exports = (sequelize, DataTypes) => {
  const OTPManager = sequelize.define('OTPManager', {
    otp_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    email_verify_otp: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mobile_verify_otp: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password_reset_otp: {
      type: DataTypes.STRING,
      allowNull: true
    },
    order_receive_otp: {
      type: DataTypes.STRING,
      allowNull: true
    },
    order_verify_otp: {
      type: DataTypes.STRING,
      allowNull: true
    },
    others_otp: {
      type: DataTypes.STRING,
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
    tableName: 'otp_managers',
    timestamps: true,
    paranoid: true
  });

  return OTPManager;
};
