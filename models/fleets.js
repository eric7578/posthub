import assert from 'assert';

import knex from './knex.js';

export async function findByEntityId(entityId) {
  const [task] = await knex
  .select('e.id as entityId', 'f.id as fleetId', 'f.estimated', 'f.elapsed')
  .from('entities as e')
  .where('e.id', entityId)
  .innerJoin('fleets as f', 'e.id', '=', 'f.entityId')
  .limit(1);

  return task || null;
}

export async function create(entityId, estimated, elapsed = 0) {
  assert.ok(elapsed <= estimated, 'Unreasonable time setup');

  const insertData = {
    entityId,
    estimated,
    elapsed,
  };

  const [fleetId] = await knex
  .insert(insertData)
  .into('fleets');

  return {
    fleetId,
    ...insertData,
  };
}
