import { expect } from 'chai';

import knex from './knex.js';
import * as mailIdentity from './mailIdentity.js';
import * as entity from './entity.js';
import { grant, isGranted, provoke, provokeAll } from './permission.js';
import { ACCESS, MODIFY, REMOVE, EDITOR } from './permissionSamples.js';

describe('permission', () => {

  const mail = 'somebody@mail.com';
  const password = 'password';
  let user, root;

  before(async () => {
    await knex.migrate.latest();
    user = await mailIdentity.create('somebody@mail.com', 'password');
    root = await entity.createRoot('new root');
  });

  after(async () => {
    await knex.migrate.rollback();
  });

  beforeEach(async () => {
    await grant(user.userId, root.entityId, ...EDITOR);
  });

  afterEach(async () => {
    await provokeAll(user.userId, root.entityId);
  });

  describe('#isGranted', () => {

    it('should grant user\'s ACCESS, MODIFY', async () => {
      const isEditor = await isGranted(user.userId, root.entityId, ACCESS, MODIFY);
      const removed = await isGranted(user.userId, root.entityId, REMOVE);
      expect(isEditor).to.be.true;
      expect(removed).to.be.false;
    });

  });

  describe('#provoke / #provokeAll', () => {

    it('should provoke specificated granted', async () => {
      await provoke(user.userId, root.entityId, MODIFY);
      const isAccess = await isGranted(user.userId, root.entityId, ACCESS);
      const isModify = await isGranted(user.userId, root.entityId, MODIFY);
      const isRemove = await isGranted(user.userId, root.entityId, REMOVE);
      expect(isAccess).to.be.true;
      expect(isModify).to.be.false;
      expect(isRemove).to.be.false;
    });

    it('should provoke all granted', async () => {
      await provokeAll(user.userId, root.entityId);
      const isAccess = await isGranted(user.userId, root.entityId, ACCESS);
      const isModify = await isGranted(user.userId, root.entityId, MODIFY);
      const isRemove = await isGranted(user.userId, root.entityId, REMOVE);
      expect(isAccess).to.be.false;
      expect(isModify).to.be.false;
      expect(isRemove).to.be.false;
    });

  });

});
