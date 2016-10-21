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

  return createPermission({
    permissionId: permissionsId[0],
    userId,
    entityId,
    auth: newAuth,
  });
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

  return createPermission({
    permissionId: id,
    userId,
    entityId,
    auth: newAuth,
  });
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

  return createPermission({
    permissionId: permission.id,
    userId,
    entityId,
    auth: 0,
  });
}

export async function findByEntityId(entityId) {
  const permissions = await knex
  .select('id', 'userId', 'auth')
  .from('permissions')
  .where({ entityId });

  return permissions.map(p => createPermission({
    permissionId: p.id,
    userId: p.userId,
    entityId,
    auth: p.auth,
  }));
}

export async function findByUserId(userId) {
  const permissions = await knex
  .select('id', 'entityId', 'auth')
  .from('permissions')
  .where({ userId });

  return permissions.map(p => createPermission({
    permissionId: p.id,
    userId,
    entityId: p.entityId,
    auth: p.auth,
  }));
}

export async function find(userId, entityId) {
  const [permission] = await knex
  .select('id', 'auth')
  .from('permissions')
  .where({ userId, entityId });

  return createPermission({
    permissionId: permission.id,
    userId,
    entityId,
    auth: permission.auth,
  });
}

function createPermission(permission) {
  return {
    ...permission,
    isGranted(...authes) {
      return isSet(this.auth, ...authes);
    }
  }
}
