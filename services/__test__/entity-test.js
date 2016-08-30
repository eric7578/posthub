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
