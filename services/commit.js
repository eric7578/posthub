import assert from 'assert';

import * as entities from '../models/entities.js';
import { isJoinOrigin } from './origin.js';

export async function createCommit(user, origin, parent = null, title) {
  const isGranted = await isJoinOrigin(user, origin);
  assert.ok(isGranted, 'Permission denied');

  parent = parent || origin;
  const commit = await entities.create(parent.entityId, title);
  return commit;
}

export async function checkoutCommit(user, origin, commit = null) {
  const isGranted = await isJoinOrigin(user, origin);
  assert.ok(isGranted, 'Permission denied');

  commit = commit || origin;
  const c = await entities.findByEntityId(commit.entityId);
  return c;
}

export async function checkoutBranchedCommits(user, origin, commit = null) {
  const isGranted = await isJoinOrigin(user, origin);
  assert.ok(isGranted, 'Permission denied');

  const c = await entities.findByEntityId(commit.entityId);
  assert.ok(c, `Commit(${commit.entityId}) not found`);

  const commits = await entities.findByParentId(c.entityId);
  return commits;
}
