import { expect, spy } from 'chai';
import proxyquire from 'proxyquire';

import { createOrigin, isJoinOrigin, listJoins, listOrigins } from './origin.js';
import { OWNER, EDITOR } from '../models/permissionSamples.js';
import { set } from '../utils/bitop.js';

describe('origin', () => {

  let permission, entity, mailIdentity, service;

  beforeEach(() => {
    permission = {};
    mailIdentity = {};
    entity = {};
    service = proxyquire('./origin.js', {
      '../models/permission.js': permission,
      '../models/mailIdentity.js': mailIdentity,
      '../models/entity.js': entity,
    });
  });

  describe('#createOrigin', () => {

    it('should create new origin at top of all levels', async () => {
      const user = { userId: 1 };
      const title = 'new origin';
      const createdEntity = { entityId: 2 };
      entity.createRoot = spy(() => ({ entityId: 2 }));
      permission.grant = spy();

      const origin = await service.createOrigin(user, title);

      expect(entity.createRoot).to.have.been.called.with.exactly(title);
      expect(permission.grant).to.have.been.called.with.exactly(user.userId, createdEntity.entityId, ...OWNER);
      expect(origin.entityId).to.be.equal(createdEntity.entityId);
    });

  });

  describe('#joinOrigin', () => {

    it('should grant user with editor permission', async () => {
      const user = { userId: 1 };
      const entity = { entityId: 2, level: 0 };
      permission.grant = spy();

      await service.joinOrigin(user, entity);

      expect(permission.grant).to.have.been.called.with.exactly(user.userId, entity.entityId, ...EDITOR);
    });

    it('should be rejected if entity is not in root level', async () => {
      const user = { userId: 1 };
      const entity = { entityId: 2, level: 1 };
      permission.grant = spy();

      await expect(service.joinOrigin(user, entity)).to.be.rejectedWith('Should be root level');
    });

  });

  describe('#inOrigin', () => {

    it('should grant user with owner permisson', async () => {
      const user = { userId: 1 };
      const entity = { entityId: 2 };
      permission.isGranted = spy(() => true);

      const isJoin = await service.inOrigin(user, entity);

      expect(permission.isGranted).to.have.been.called.with.exactly(user.userId, entity.entityId, ...EDITOR);
      expect(isJoin).to.be.true;
    });

  });

  describe('#listOrigins', () => {

    it('should list users\' accessable origins', async () => {
      const user = { userId: 1 };
      const permissions = [
        { entityId: 1, auth: set(0, ...OWNER) },
        { entityId: 2, auth: set(0, ...EDITOR) },
        { entityId: 3, auth: 0 },
      ];
      permission.findByUserId = spy(() => permissions);
      permission.isGranted = spy((userId, entityId) => entityId !== 3);
      entity.findByEntityId = spy();

      await service.listOrigins(user);

      expect(permission.findByUserId).to.have.been.called.with.exactly(user.userId);

      expect(permission.isGranted).to.have.been.called.exactly(3);
      expect(permission.isGranted).to.have.been.called.with.exactly(user.userId, permissions[0].entityId, ...EDITOR);
      expect(permission.isGranted).to.have.been.called.with.exactly(user.userId, permissions[1].entityId, ...EDITOR);
      expect(permission.isGranted).to.have.been.called.with.exactly(user.userId, permissions[2].entityId, ...EDITOR);

      expect(entity.findByEntityId).to.have.been.called.exactly(2);
      expect(entity.findByEntityId).to.have.been.called.with.exactly(1);
      expect(entity.findByEntityId).to.have.been.called.with.exactly(2);
      expect(entity.findByEntityId).to.not.have.been.called.with.exactly(3);
    });

  });

  describe('#listOriginMembers', () => {

    it('should list all joined users', async () => {
      const origin = { entityId: 1 };
      const permissions = [
        { userId: 1, auth: set(0, ...OWNER) },
        { userId: 2, auth: set(0, ...EDITOR) },
        { userId: 3, auth: 0 },
      ];
      permission.findByEntityId = spy(() => permissions);
      mailIdentity.findByUserId = spy();

      await service.listOriginMembers(origin);

      expect(permission.findByEntityId).to.have.been.called.with.exactly(origin.entityId);

      expect(mailIdentity.findByUserId).to.have.been.called.exactly(2);
      expect(mailIdentity.findByUserId).to.have.been.called.with.exactly(permissions[0].userId);
      expect(mailIdentity.findByUserId).to.have.been.called.with.exactly(permissions[1].userId);
    });

  });

});
