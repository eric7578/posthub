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

  context('test deep nested tree', () => {

    let root, sub1, sub2, grand1, grand2;
    before(() => {
      return entityService.createRoot()
      .then(result => {
        root = result;
        return Promise.all([
          entityService.createSub({ parentId: root.id }),
          entityService.createSub({ parentId: root.id })
        ]);
      })
      .then(results => {
        sub1 = results[0];
        sub2 = results[1];
        return Promise.all([
          entityService.createSub({ parentId: results[0].id }),
          entityService.createSub({ parentId: results[1].id })
        ]);
      })
      .then(results => {
        grand1 = results[0];
        grand2 = results[1];
      });
    });

    describe('#getChildren', () => {

      it('should read next level of entity tree', () => {
        return entityService.getChildren(root.id)
        .then(children => {
          expect(Object.keys(children)).to.have.lengthOf(2);
          expect(children[sub1.id].id).to.be.equal(sub1.id);
          expect(children[sub2.id].id).to.be.equal(sub2.id);
          expect(children[sub1.id].level).to.be.equal(1);
          expect(children[sub2.id].level).to.be.equal(1);
        });
      });

    });

    describe('#getChildren', () => {

      it('should read until the end of entity tree', () => {
        return entityService.getFlattenTree(root.id).then(tree => {
          expect(Object.keys(tree)).to.have.lengthOf(5);
          expect(tree.root.id).to.be.equal(root.id);
          expect(tree.root.level).to.be.equal(0);
          expect(tree[sub1.id].id).to.be.equal(sub1.id);
          expect(tree[sub2.id].id).to.be.equal(sub2.id);
          expect(tree[sub1.id].level).to.be.equal(1);
          expect(tree[sub2.id].level).to.be.equal(1);
          expect(tree[grand1.id].id).to.be.equal(grand1.id);
          expect(tree[grand2.id].id).to.be.equal(grand2.id);
          expect(tree[grand1.id].level).to.be.equal(2);
          expect(tree[grand2.id].level).to.be.equal(2);
        });
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
