import assert from 'assert';

import * as mailIdentityModel from '../models/mailIdentity.js';
import * as entityModel from '../models/entity.js';
import * as permissionModel from '../models/permission.js';
import { READER, EDITOR, OWNER } from '../models/permissionSamples.js';

export async function makeCommit(user, message, parent) {
  if (!!parent) {
    const permission = await permissionModel.find(user.userId, parent.entityId);
    assert.ok(await permission.isGranted(...EDITOR), 'Permission denied');
    const commit = await entityModel.create(parent.entityId, message);
    await permissionModel.grant(user.userId, commit.entityId, ...OWNER);
    return commit;
  } else {
    const root = await entityModel.createRoot(message);
    await permissionModel.grant(user.userId, root.entityId, ...OWNER);
    return root;
  }
}

export async function joinCommit(user, entity) {
  await permissionModel.grant(user.userId, entity.entityId, ...EDITOR);
}

export async function listMembers(user, entity) {
  const permission = await permissionModel.find(user.userId, entity.entityId);
  assert.ok(permission.isGranted(...READER), 'Permission denied');

  const permissions = await permissionModel.findByEntityId(entity.entityId);
  const users = [];
  for (let p of permissions) {
    if (p.isGranted(...EDITOR)) {
      const user = await mailIdentityModel.findByUserId(p.userId);
      users.push(user);
    }
  }
  return users;
}

export async function listMemberParticipated(user) {
  const permissions = await permissionModel.findByUserId(user.userId);
  const entities = [];
  for (let p of permissions) {
    if (p.isGranted(...EDITOR)) {
      const entity = await entityModel.findByEntityId(p.entityId);
      entities.push(entity);
    }
  }
  return entities;
}

export async function checkoutBranchedCommits(user, parent, commit = null) {
  const permission = await permissionModel.find(user.userId, parent.entityId);
  assert.ok(permission.isGranted(...READER), 'Permission denied');
  return await entityModel.findByParentId(parent.entityId);
}
