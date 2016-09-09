import { sequelize } from '../models';

before(() => {
  return sequelize.sync({ force: true });
});
