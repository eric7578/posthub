import assert from 'assert';

import * as entities from '../models/entities.js';
import * as permissions from '../models/permissions.js';
import * as users from '../models/users.js';
import { OWNER, EDITOR, READER } from '../models/permissionSamples.js';
import { isSet } from '../utils/bitop.js';

export async function createOrigin(user, title) {
  const origin = await entities.createRoot(title);
  await permissions.grant(user.userId, origin.entityId, ...OWNER);
  return {
    ...origin,
  };
}

export async function listOrigins(user) {
  const origins = [];
  const { userId } = user;
  const ps = await permissions.findByUserId(userId);
  for (let i = 0; i < ps.length; i++) {
    const { entityId } = ps[i];
    const isAllow = await permissions.isGranted(userId, entityId, ...READER);
    if (isAllow) {
      const origin = await entities.findByEntityId(entityId);
      origins.push(origin);
    }
  }

  return origins;
}

export async function joinOrigin(user, origin) {
  assert.equal(origin.level, 0, 'Should be root level');
  await permissions.grant(user.userId, origin.entityId, ...OWNER);
}

export async function isJoinOrigin(user, origin) {
  return await permissions.isGranted(user.userId, origin.entityId, ...OWNER);
}

export async function listJoins(origin) {
  const ps = await permissions.findByEntityId(origin.entityId);
  const joins = await Promise.all(
    ps.filter(p => isSet(p.auth, ...OWNER))
      .map(p => users.findByUserId(p.userId))
  );
  return joins;
}
