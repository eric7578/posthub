import { expect } from 'chai';

import entityService from '../entity';
import permissionService from '../permission';
import { set } from '../../utils/bitop.js'
import { ACCESS, MODIFY, REMOVE, EDITOR, OWNER } from '../../models/PermissionSample';

describe('permissionService', () => {

  let entity;
  beforeEach(() => entityService.createRoot().then(e => entity = e));

  describe('#setPermission', () => {

    it('should return current participants', () => {
      return permissionService.setPermission({
          entityId: entity.id,
          userId: defaultUser.id,
          permission: 1
      })
      .then(result => permissionService.getParticipants(entity.id))
      .then(participants => {
        expect(participants).to.have.lengthOf(1);
        expect(participants[0].id).to.be.equal(defaultUser.id);
      });
    });

    it('should set permission with given samples', () => {
      return permissionService.setPermission({
        entityId: entity.id,
        userId: defaultUser.id,
        sample: [ACCESS, REMOVE]
      })
      .then(result => permissionService.hasPermission({
        entityId: entity.id,
        userId: defaultUser.id,
        sample: [ACCESS, REMOVE]
      }))
      .then(result => expect(result).to.be.true);
    });

    it('should match sample of alias', () => {
      return permissionService.setPermission({
        entityId: entity.id,
        userId: defaultUser.id,
        sample: [ACCESS, MODIFY]
      })
      .then(result => Promise.all([
        permissionService.hasPermission({
          entityId: entity.id,
          userId: defaultUser.id,
          permission: EDITOR
        }),
        permissionService.hasPermission({
          entityId: entity.id,
          userId: defaultUser.id,
          sample: [ACCESS, MODIFY]
        }),
        permissionService.hasPermission({
          entityId: entity.id,
          userId: defaultUser.id,
          permission: OWNER
        }),
        permissionService.hasPermission({
          entityId: entity.id,
          userId: defaultUser.id,
          sample: [ACCESS, MODIFY, REMOVE]
        })
      ]))
      .then(permissions => {
        const [isEditor, isEditor2, isOwner, isOwner2] = permissions;
        expect(isEditor).to.be.true;
        expect(isEditor2).to.be.true;
        expect(isOwner).to.be.false;
        expect(isOwner2).to.be.false;
      });
    });

  });

});
