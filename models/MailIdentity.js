import { createHash } from 'crypto';

import { MailIdentity } from './index';

export default (sequelize, DataTypes) => sequelize.define('MailIdentity', {
  mail: {
    type: DataTypes.STRING,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  salt: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    set(value) {
      const salt = Math.floor(Math.random() * 10000).toString(8);

      const sha1 = createHash('sha1');
      sha1.update(salt);
      sha1.update(value);
      const password = sha1.digest('hex');

      this.setDataValue('salt', salt);
      this.setDataValue('password', password);
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'User',
      key: 'id'
    }
  }
}, {
  freezeTableName: true,
  updatedAt: false,
  classMethods: {
    associate(models) {
      const { MailIdentity, User } = models;

      MailIdentity.belongsTo(User, {
        foreignKey: 'userId'
      });
    },
    async findByMail(mail) {
      return await MailIdentity.findOne({
        where: { mail }
      });
    }
  },
  instanceMethods: {
    checkPassword(password) {
      const sha1 = createHash('sha1');
      sha1.update(this.salt);
      sha1.update(password);
      return sha1.digest('hex') === this.password;
    },
    toResponseJSON() {
      // remove id
      const { id, ...responseData } = this.toJSON();
      return responseData;
    }
  }
});
