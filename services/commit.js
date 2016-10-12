import assert from 'assert';

import * as entity from '../models/entity.js';
import { inOrigin } from './origin.js';

export async function makeCommit(user, title, parent) {
  if (!!parent) {
    return await entity.create(parent.entityId, title);
  } else {
    return await entity.createRoot(title);
  }
}

export async function enhanceCommit(user, origin, entity, enhancers) {
  const isGranted = await inOrigin(user, origin);
  assert.ok(isGranted, 'Permission denied');

  for (let enhancer in enhancers) {
    const enhacedResult = await enhancers[enhancer](entity);
    entity = Object.assign(entity, {
      [enhancer]: enhacedResult
    });
  }

  return entity;
}

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
