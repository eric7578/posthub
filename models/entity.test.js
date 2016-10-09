import { expect } from 'chai';

import knex from './knex.js';
import { createRoot, create, findByEntityId, findByParentId } from './entity.js';

describe('entity', () => {

  let root, subEntity;

  before(async () => {
    await knex.migrate.latest();
    root = await createRoot('new root');
    subEntity = await create(root.entityId, 'sub-entity title');
  });

  after(async () => {
    await knex.migrate.rollback();
  });

  it('should create a new root entity', () => {
    expect(root.entityId).to.be.a('number');
    expect(root.level).to.be.equal(0);
    expect(root.createAt).to.be.a('number');
    expect(root.updateAt).to.be.a('number');
  });

  it('should create a sub-entity under root', () => {
    expect(subEntity.entityId).to.be.a('number');
    expect(subEntity.level).to.be.equal(root.level + 1);
    expect(subEntity.createAt).to.be.a('number');
    expect(subEntity.updateAt).to.be.a('number');
  });

  describe('#findByEntityId', () => {

    it('should find entity by entityId', async () => {
      const entity = await findByEntityId(subEntity.entityId);
      expect(entity).to.be.deep.equal(subEntity);
    });

    it('should return null if not found', async () => {
      const entity = await findByEntityId(0);
      expect(entity).to.be.null;
    });

  });

  describe('#findByParentId', () => {

    it('should find entities by parentId', async () => {
      const entities = await findByParentId(root.entityId);
      expect(entities).to.be.deep.equal([subEntity]);
    });

  });

});
