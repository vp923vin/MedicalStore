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
    auth_token:{
      type: DataTypes.STRING(150),
      allowNull: true
    },
    otp: {
      type: DataTypes.INTEGER(10),
      allowNull: false
    },
    otp_reason: {
      type: DataTypes.ENUM('email_verify', 'password_reset', 'payment_verify', 'order_verify', 'mobile_verify', 'ticket_verify', 'register_user', 'other_verify'),
      allowNull: false
    },
    otp_status: {
      type: DataTypes.ENUM('delivered', 'verified'),
      allowNull: true
    },
    otp_expiry:{
      type: DataTypes.STRING(150),
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
    expiresAt: {
      type: DataTypes.DATE,
      field: 'expires_at'
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
