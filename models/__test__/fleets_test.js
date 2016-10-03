import { expect } from 'chai';

import knex from '../knex.js';
import * as fleets from '../fleets.js';
import { regist } from '../../services/user.js';
import { createOrigin } from '../../services/origin.js';
import { createCommit } from '../../services/commit.js';

describe('models/fleets', () => {

  let user, otherUser, origin, commit;
  const commitTitle = 'new commit';

  before(async () => {
    await knex.migrate.latest();
    user = await regist('user@mail.com', 'password');
    origin = await createOrigin(user, 'new origin');
    commit = await createCommit(user, origin, null, commitTitle);
  });

  after(async () => {
    await knex.migrate.rollback();
  });

  describe('#create', () => {

    it('should create fleet by entityId', async () => {
      const fleet = await fleets.create(commit.entityId, 10);
      expect(fleet.fleetId).to.be.a('number');
      expect(fleet.entityId).to.be.equal(commit.entityId);
      expect(fleet.estimated).to.be.equal(10);
      expect(fleet.elapsed).to.be.equal(0);
    });

  });

  describe('#findByEntityId', () => {

    it('should be found by entityId', async () => {
      const fleet = await fleets.findByEntityId(commit.entityId);
      expect(fleet.fleetId).to.be.a('number');
      expect(fleet.entityId).to.be.equal(commit.entityId);
      expect(fleet.estimated).to.be.equal(10);
      expect(fleet.elapsed).to.be.equal(0);
    });

  });

});
