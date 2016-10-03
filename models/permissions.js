import knex from './knex.js';

import { set, isSet, clear } from '../utils/bitop.js';

export async function grant(userId, entityId, ...authorizations) {
  const permissions = await knex
  .select('id', 'auth')
  .from('permissions')
  .where({ userId, entityId });

  let permissionsId, newAuth;
  if (!!permissions[0]) {
    newAuth = set(permissions[0].auth, ...authorizations);
    permissionsId = await knex
    .update({ auth: newAuth })
    .from('permissions')
    .where({ id: permissions[0].id });
  } else {
    newAuth = set(0, ...authorizations);
    permissionsId = await knex
    .insert({
      userId,
      entityId,
      auth: newAuth,
    })
    .into('permissions');
  }

  return {
    permissionId: permissionsId[0],
    auth: newAuth,
  };
}

export async function provoke(userId, entityId, ...authorizations) {
  const permissions = await knex
  .select('id', 'auth')
  .from('permissions')
  .where({ userId, entityId });

  const permission = permissions[0];
  if (!permission) {
    return null;
  }

  const { id, auth } = permission;
  const newAuth = clear(auth, ...authorizations);
  await knex
  .update({ auth: newAuth })
  .from('permissions')
  .where({ id });

  return {
    permissionId: id,
    auth: newAuth,
  };
}

export async function provokeAll(userId, entityId) {
  const permissions = await knex
  .select('id')
  .from('permissions')
  .where({ userId, entityId });

  const permission = permissions[0];
  if (!permission) {
    return null;
  }

  await knex
  .update({ auth: 0 })
  .from('permissions')
  .where({ id: permission.id });

  return {
    permissionId: permission.id,
    auth: 0,
  };
}

export async function isGranted(userId, entityId, ...authorizations) {
  const permissions = await knex
  .select('auth')
  .from('permissions')
  .where({ userId, entityId });

  if (!!permissions[0]) {
    return isSet(permissions[0].auth, ...authorizations);
  } else {
    return false;
  }
}

export async function findByEntityId(entityId) {
  return await knex
  .select('userId', 'auth')
  .from('permissions')
  .where({ entityId });
}

export async function findByUserId(userId) {
  return await knex
  .select('entityId', 'auth')
  .from('permissions')
  .where({ userId });
}
