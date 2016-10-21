import { expect } from 'chai';

import knex from './knex.js';
import * as mailIdentity from './mailIdentity.js';
import * as entity from './entity.js';
import { grant, provoke, provokeAll, findByEntityId, findByUserId, find } from './permission.js';
import { ACCESS, MODIFY, REMOVE, READER, EDITOR, OWNER } from './permissionSamples.js';

describe('permission', () => {
  const mail = 'somebody@mail.com';
  const password = 'password';
  let user, root, permission;

  before(async () => {
    await knex.migrate.latest();
    user = await mailIdentity.create('somebody@mail.com', 'password');
    root = await entity.createRoot('new root');
  });

  after(async () => {
    await knex.migrate.rollback();
  });

  afterEach(async () => {
    await provokeAll(user.userId, root.entityId);
  });

  describe('#grant', () => {
    it('should generate permission with give authorizations', async () => {
      const permission = await grant(user.userId, root.entityId, ...EDITOR);
      expect(permission.isGranted(ACCESS)).to.be.true;
      expect(permission.isGranted(MODIFY)).to.be.true;
      expect(permission.isGranted(REMOVE)).to.be.false;
      expect(permission.isGranted(...READER)).to.be.true;
      expect(permission.isGranted(...EDITOR)).to.be.true;
      expect(permission.isGranted(...OWNER)).to.be.false;
    });
  });

  describe('#provoke', () => {
    it('should provoke specificated granted', async () => {
      await grant(user.userId, root.entityId, ...EDITOR);
      const permission = await provoke(user.userId, root.entityId, MODIFY);
      expect(permission.isGranted(ACCESS)).to.be.true;
      expect(permission.isGranted(MODIFY)).to.be.false;
      expect(permission.isGranted(REMOVE)).to.be.false;
    });
  });

  describe('#provokeAll', () => {
    it('should provoke all granted', async () => {
      await grant(user.userId, root.entityId, ...EDITOR);
      const permission = await provokeAll(user.userId, root.entityId);
      expect(permission.isGranted(ACCESS)).to.be.false;
      expect(permission.isGranted(MODIFY)).to.be.false;
      expect(permission.isGranted(REMOVE)).to.be.false;
    });
  });

  describe('#findByEntityId', () => {
    it('should find all permission with entityId', async () => {
      const permissions = await findByEntityId(root.entityId);
      expect(permissions).to.have.lengthOf(1);
      expect(permissions[0].permissionId).to.be.a('number');
      expect(permissions[0].userId).to.be.equal(user.userId);
      expect(permissions[0].entityId).to.be.equal(root.entityId);
    });
  });

  describe('#findByUserId', () => {
    it('should find all permissions with userId', async () => {
      const permissions = await findByUserId(user.userId);
      expect(permissions).to.have.lengthOf(1);
      expect(permissions[0].permissionId).to.be.a('number');
      expect(permissions[0].userId).to.be.equal(user.userId);
      expect(permissions[0].entityId).to.be.equal(root.entityId);
    });
  });

  describe('#find', () => {
    it('should find one permission with userId and entityId', async () => {
      const permission = await find(user.userId, root.entityId);
      expect(permission.permissionId).to.be.a('number');
      expect(permission.userId).to.be.equal(user.userId);
      expect(permission.entityId).to.be.equal(root.entityId);
    });
  });
});
