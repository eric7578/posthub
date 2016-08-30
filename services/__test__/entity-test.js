import { expect } from 'chai';

import entityService from '../entity';

describe('entityService', () => {

  describe('#createRoot', () => {

    it('should create new root at top of levels', () => {
      return entityService.createRoot()
      .then(entity => {
        expect(entity.title).to.be.equal('Untitled');
        expect(entity.level).to.be.equal(0);
        expect(entity.parentId).to.be.undefined;
      });
    });

  });

  describe('#createSub', () => {

    it('should create sub-entity with increment level', () => {
      return entityService.createRoot().then(root => {
        return entityService.createSub({ parentId: root.id })
        .then(subEntity => {
          expect(subEntity.parentId).to.be.equal(root.id);
          expect(subEntity.level).to.be.equal(root.level + 1);
        });
      });
    })

    it('should reject if parent entity not exist', () => {
      return expect(
        entityService.createSub({ parentId: 0 })
      )
      .to.be.rejectedWith('Parent not found');
    });

  });

  describe('#setPermission', () => {

    it('should return current participants', () => {
      return entityService.createRoot().then(entity => {
        return entityService.setPermission({
          entityId: entity.id,
          userId: defaultUser.id,
          permission: 1
        })
        .then(result => entityService.getParticipants(entity.id))
        .then(participants => {
          expect(participants).to.have.lengthOf(1);
          expect(participants[0].id).to.be.equal(defaultUser.id);
        });
      });
    });

  });

});
