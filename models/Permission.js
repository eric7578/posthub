export default (sequelize, DataTypes) => sequelize.define('Permission', {
  entityId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Entity',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  auth: {
    type: DataTypes.INTEGER,
    default: 0,
    allowNull: null
  }
}, {
  freezeTableName: true,
  timestamps: false,
  classMethods: {
    associate(models) {
      const { Permission, User, Entity } = models;

      Permission.belongsTo(User, {
        foreignKey: 'userId'
      });

      Permission.belongsTo(Entity, {
        foreignKey: 'entityId'
      });
    }
  },
  instanceMethods: {
    isAuth(...authes) {

    },
    toResponseJSON() {
      return this.toJSON();
    }
  }
});
