import { expect, spy } from 'chai';
import proxyquire from 'proxyquire';

import { OWNER, EDITOR } from '../models/permissionSamples.js';
import { set } from '../utils/bitop.js';

describe('commit', () => {

  let permission, entity, mailIdentity, origin, service;

  beforeEach(() => {
    permission = {};
    mailIdentity = {};
    entity = {};
    origin = {};
    service = proxyquire('./commit.js', {
      '../models/permission.js': permission,
      '../models/mailIdentity.js': mailIdentity,
      '../models/entity.js': entity,
      './origin.js': origin,
    });
  });

  describe('#makeCommit', () => {

    it('should create new root if without parentId', async () => {
      const user = { userId: 1 };
      const title = 'new root';
      entity.createRoot = spy();

      const origin = await service.makeCommit(user, title);

      expect(entity.createRoot).to.have.been.called.with.exactly(title);
    });

    it('should create new sub-commit with parentId', async () => {
      const user = { userId: 1 };
      const parent = { entityId: 2 };
      const title = 'new root';
      entity.create = spy();

      const origin = await service.makeCommit(user, title, parent);

      expect(entity.create).to.have.been.called.with.exactly(parent.entityId, title);
    });

  });

  describe('#enhanceCommit', () => {

    it('should decorate assign decorators to entity', async () => {
      const user = { userId: 1 };
      const originEntity = { entityId: 2 };
      const entity = { entityId: 3 };
      const enhancers = {
        enhancerFn1: spy(() => ({ enhancerId: 2 })),
        enhancerFn2: spy(() => ({ enhancerFn2Props: 'some enhance' })),
      };
      origin.inOrigin = spy(() => true);

      const enhancedEntity = await service.enhanceCommit(user, originEntity, entity, enhancers);

      expect(origin.inOrigin).to.have.been.called.once.with.exactly(user, originEntity);
      expect(enhancers.enhancerFn1).to.have.been.called.once.with.exactly(entity);
      expect(enhancers.enhancerFn2).to.have.been.called.once.with.exactly(entity);
      expect(enhancedEntity).to.be.deep.equal({
        entityId: 3,
        enhancerFn1: {
          enhancerId: 2
        },
        enhancerFn2: {
          enhancerFn2Props: 'some enhance'
        },
      })
    });

    it('should be rejected if user is without granted', async () => {
      const user = { userId: 1 };
      const originEntity = { entityId: 2 };
      origin.inOrigin = spy(() => false);

      await expect(service.enhanceCommit(user, originEntity)).to.be.rejectedWith('Permission denied');
      expect(origin.inOrigin).to.have.been.called.once.with.exactly(user, originEntity);
    });

  });

});
