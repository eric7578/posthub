import { expect, spy } from 'chai';
import proxyquire from 'proxyquire';

import { OWNER, EDITOR } from '../models/permissionSamples.js';
import { set } from '../utils/bitop.js';

describe('commit', () => {
  let permission, entity, mailIdentity, origin, service;
  const userObj = { userId: 1 };
  const entityObj = { entityId: 2 };
  const parentObj = { entityId: 3 };

  beforeEach(() => {
    permission = {};
    mailIdentity = {};
    entity = {};
    service = proxyquire('./commit.js', {
      '../models/permission.js': permission,
      '../models/mailIdentity.js': mailIdentity,
      '../models/entity.js': entity,
    });
  });

  describe('#makeCommit', () => {
    it('should create new root if without parentId', async () => {
      entity.createRoot = spy(() => entityObj);
      permission.grant = spy();
      const ret = await service.makeCommit(userObj, 'new root');

      expect(entity.createRoot).to.have.been.called.once.with.exactly('new root');
      expect(permission.grant).to.have.been.called.once.with.exactly(userObj.userId, entityObj.entityId, ...OWNER);
      expect(ret).to.be.deep.equal(entityObj);
    });

    it('should create new sub-commit with parentId', async () => {
      permission.find = spy(() => ({ isGranted: () => true }));
      entity.create = spy(() => entityObj);
      permission.grant = spy();
      const ret = await service.makeCommit(userObj, 'new root', parentObj);

      expect(permission.find).to.have.been.called.once.with.exactly(userObj.userId, parentObj.entityId);
      expect(entity.create).to.have.been.called.once.with.exactly(parentObj.entityId, 'new root');
      expect(permission.grant).to.have.been.called.once.with.exactly(userObj.userId, entityObj.entityId, ...OWNER);
      expect(ret).to.be.deep.equal(entityObj);
    });
  });

  describe('#joinCommit', () => {
    it('should grant user as EDITOR', async () => {
      permission.grant = spy();
      await service.joinCommit(userObj, entityObj);

      expect(permission.grant).to.have.been.called.once.with.exactly(userObj.userId, entityObj.entityId, ...EDITOR);
    });
  });

  describe('#listMembers', () => {
    it('should list all members with EDITOR permission', async () => {
      permission.find = spy(() => ({ isGranted: () => true }));
      permission.findByEntityId = spy(() => ([
        { userId: 5, isGranted: () => true },
        { userId: 6, isGranted: () => true },
        { userId: 7, isGranted: () => false }
      ]));
      mailIdentity.findByUserId = spy();
      await service.listMembers(userObj, entityObj);

      expect(permission.find).to.have.been.called.once.with.exactly(userObj.userId, entityObj.entityId);
      expect(permission.findByEntityId).to.have.been.called.once.with.exactly(entityObj.entityId);
      expect(mailIdentity.findByUserId).to.have.been.called.twice.with.exactly(5);
      expect(mailIdentity.findByUserId).to.have.been.called.twice.with.exactly(6);
    });
  });

  describe('#listMemberParticipated', () => {
    it('should list all member\'s participated commits', async () => {
      permission.findByUserId = spy(() => ([
        { entityId: 5, isGranted: () => true },
        { entityId: 6, isGranted: () => true },
        { entityId: 7, isGranted: () => false }
      ]));
      entity.findByEntityId = spy();
      await service.listMemberParticipated(userObj);

      expect(permission.findByUserId).to.have.been.called.once.with.exactly(userObj.userId);
      expect(entity.findByEntityId).to.have.been.called.twice.with.exactly(5);
      expect(entity.findByEntityId).to.have.been.called.twice.with.exactly(6);
    });
  });

  describe('#checkoutBranchedCommits', () => {
    it('should find all sub-commits', async () => {
      permission.find = spy(() => ({ isGranted: () => true }));
      entity.findByParentId = spy();
      await service.checkoutBranchedCommits(userObj, entityObj);

      expect(permission.find).to.have.been.called.once.with.exactly(userObj.userId, entityObj.entityId);
      expect(entity.findByParentId).to.have.been.called.once.with.exactly(entityObj.entityId);
    });
  });
});
