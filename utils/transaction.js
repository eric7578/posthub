import { sequelize } from '../models';

export default function transaction(target, key, descriptor) {
  return {
    ...descriptor,
    async value(...args) {
      const t = await sequelize.transaction();
      try {
        return await descriptor.value.apply(this, args);
      } catch(err) {
        t.rollback();
        // continue error propagation
        throw err;
      }
      t.commit();
    }
  };
}
