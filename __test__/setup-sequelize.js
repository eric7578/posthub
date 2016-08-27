import { sequelize } from '../models';

before(done => {
  sequelize
  .sync({ force: true })
  .then(() => done())
  .catch(err => done(err));
});
