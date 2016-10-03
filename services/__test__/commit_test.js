import { expect } from 'chai';

import knex from '../../models/knex.js';
import { regist } from '../user.js';
import { createCommit, checkoutCommit, checkoutBranchedCommits } from '../commit.js';
import { createOrigin } from '../origin.js';

describe('services/commit', () => {

  let user, otherUser, origin, commit, subCommit;
  const commitTitle = 'new commit';
  const subCommitTitle = 'new sub commit';

  before(async () => {
    await knex.migrate.latest();
    user = await regist('user@mail.com', 'password');
    otherUser = await regist('other@mail.com', 'password');
    origin = await createOrigin(user, 'new origin');
    commit = await createCommit(user, origin, null, commitTitle);
    subCommit = await createCommit(user, origin, commit, subCommitTitle);
  });

  after(async () => {
    await knex.migrate.rollback();
  });

  describe('#createCommit', () => {

    it('should create commit under origin', async () => {
      expect(commit.entityId).to.be.a('number');
      expect(commit.parentId).to.be.equal(origin.entityId);
      expect(commit.level).to.be.equal(1);
      expect(commit.title).to.be.equal(commitTitle);
    });

    it('should create sub-commit under commit', async () => {
      expect(subCommit.entityId).to.be.a('number');
      expect(subCommit.parentId).to.be.equal(commit.entityId);
      expect(subCommit.level).to.be.equal(2);
      expect(subCommit.title).to.be.equal(subCommitTitle);
    });

    it('should forbid otherUser from access', async () => {
      const { entityId } = commit;
      await expect(createCommit(otherUser, origin, null, 'title')).to.be.rejectedWith('Permission denied');
    });

  });

  describe('#checkoutCommit', () => {

    it('should get commit\'s info', async () => {
      const { entityId } = commit;
      const c = await checkoutCommit(user, origin, { entityId });
      expect(c).to.be.deep.equal(commit);
    });

    it('should forbid otherUser from access', async () => {
      const { entityId } = commit;
      await expect(checkoutCommit(otherUser, origin, { entityId })).to.be.rejectedWith('Permission denied');
    });

  });

  describe('#checkoutBranchedCommits', () => {

    it('should get all commits under target commit', async () => {
      const { entityId } = commit;
      const commits = await checkoutBranchedCommits(user, origin, { entityId });
      expect(commits).to.have.lengthOf(1);
      expect(commits[0]).to.be.deep.equal(subCommit);
    });

    it('should forbid otherUser from access', async () => {
      const { entityId } = commit;
      await expect(checkoutBranchedCommits(otherUser, origin, { entityId })).to.be.rejectedWith('Permission denied');
    });

  });

});
