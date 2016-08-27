import { createHash } from 'crypto';

export default (sequelize, DataTypes) => sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  token: {
    type: DataTypes.STRING
  },
  lastLoginAt: {
    type: DataTypes.DATE
  }
}, {
  freezeTableName: true,
  updatedAt: false,
  classMethods: {
    async findByToken(token) {
      return await Entity.findOne({
        where: { token }
      });
    }
  },
  instanceMethods: {
    refreshToken() {
      const sha1 = createHash('sha1');
      sha1.update(Date.now().toString());
      sha1.update((Math.random() * 1000 >> 0).toString());
      this.token = sha1.digest('hex');
    },

    toResponseJSON(...identities) {
      const { id, ...responseData } = this.toJSON();
      responseData.identities = identities.map(identity => {
        if (identity.userId === this.id) {
          return identity.toResponseJSON();
        } else {
          throw new Error(`identitiy(${identity.name}) and user are not connected`);
        }
      });

      return responseData;
    }
  }
});
