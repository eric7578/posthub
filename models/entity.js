import assert from 'assert';

import knex from './knex.js';

export async function createRoot(title) {
  const now = Date.now();
  const insertData = {
    parentId: null,
    title,
    level: 0,
    createAt: now,
    updateAt: now,
  };

  const [id] = await knex
  .insert(insertData)
  .into('entities');

  return {
    entityId: id,
    ...insertData,
  };
}

export async function create(parentId, title) {
  const [parent] = await knex
  .select()
  .from('entities')
  .where({ id: parentId })
  .limit(1);
  assert.ok(parent, 'Parent not found');

  const now = Date.now();
  const insertData = {
    parentId,
    title,
    level: parent.level + 1,
    createAt: now,
    updateAt: now,
  };

  const [id] = await knex
  .insert(insertData)
  .into('entities');

  return {
    entityId: id,
    ...insertData,
  };
}

export async function findByEntityId(entityId) {
  const entities = await knex
  .select()
  .from('entities')
  .where({ id: entityId });

  if (!entities[0]) {
    return null;
  }

  const { id, ...entity } = entities[0];
  return {
    entityId: id,
    ...entity,
  };
}

export async function findByParentId(parentId) {
  const entities = await knex
  .select()
  .from('entities')
  .where({ parentId });

  return entities.map(({ id, ...entity }) => ({
    entityId: id,
    ...entity,
  }));
}
