export default (sequelize, DataTypes) => sequelize.define('Entity', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  parentId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Entity',
      key: 'id'
    }
  }
}, {
  timestamps: false,
  freezeTableName: true,
  classMethods: {
    associate(models) {
      const { Entity } = models;

      Entity.belongsTo(Entity, {
        as: 'parent',
        foreignKey: 'parentId'
      });
    }
  },
  instanceMethods: {
    toResponseJSON(characterModel) {
      return this.toJSON();
    }
  }
});
