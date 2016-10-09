import assert from 'assert';

import * as entity from '../models/entity.js';
import * as permission from '../models/permission.js';
import * as mailIdentity from '../models/mailIdentity.js';
import { OWNER, EDITOR, READER } from '../models/permissionSamples.js';
import { isSet } from '../utils/bitop.js';

export async function createOrigin(user, title) {
  const origin = await entity.createRoot(title);
  await permission.grant(user.userId, origin.entityId, ...OWNER);
  return {
    ...origin,
  };
}

export async function joinOrigin(user, origin) {
  assert.equal(origin.level, 0, 'Should be root level');
  await permission.grant(user.userId, origin.entityId, ...EDITOR);
}

export async function inOrigin(user, origin) {
  return await permission.isGranted(user.userId, origin.entityId, ...EDITOR);
}

export async function listOrigins(user) {
  const origins = [];
  const { userId } = user;
  const ps = await permission.findByUserId(userId);
  for (let i = 0; i < ps.length; i++) {
    const { entityId } = ps[i];
    const isAllow = await permission.isGranted(userId, entityId, ...EDITOR);
    if (isAllow) {
      const origin = await entity.findByEntityId(entityId);
      origins.push(origin);
    }
  }

  return origins;
}

export async function listOriginMembers(origin) {
  const ps = await permission.findByEntityId(origin.entityId);
  const joins = await Promise.all(
    ps.filter(p => isSet(p.auth, ...EDITOR))
      .map(p => mailIdentity.findByUserId(p.userId))
  );
  return joins;
}
