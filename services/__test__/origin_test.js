import { expect } from 'chai';

import knex from '../../models/knex.js';
import { regist } from '../user.js';
import { createOrigin, isJoinOrigin, listJoins, listOrigins } from '../origin.js';

describe('services/origin', () => {

  let user, otherUser, origin;
  const title = 'new origin';

  before(async () => {
    await knex.migrate.latest();
    user = await regist('user@mail.com', 'password');
    otherUser = await regist('other@mail.com', 'password');
    origin = await createOrigin(user, title);
  });

  after(async () => {
    await knex.migrate.rollback();
  });

  describe('#createOrigin', () => {

    it('should create new origin at top of all levels', () => {
      expect(origin.entityId).to.be.a('number');
      expect(origin.parentId).to.be.null;
      expect(origin.level).to.be.equal(0);
      expect(origin.title).to.be.equal(title);
    });

  });

  describe('#isJoinOrigin', () => {

    it('should grant user with owner permisson', async () => {
      const isJoin = await isJoinOrigin(user, origin);
      expect(isJoin).to.be.true;
    });

    it('should not grant otherUser with owner permission', async () => {
      const isJoin = await isJoinOrigin(otherUser, origin);
      expect(isJoin).to.be.false;
    });

  });

  describe('#listOrigins', () => {

    it('should list users\' readable origins', async () => {
      const origins = await listOrigins(user);
      expect(origins).to.have.lengthOf(1);
      expect(origins[0]).to.be.deep.equal(origin);
    });

  });

  describe('#listJoins', () => {

    it('should list granted users', async () => {
      const participants = await listJoins(origin);
      expect(participants).to.have.lengthOf(1);
      expect(participants[0]).to.be.deep.equal(user);
    });

  });

});
