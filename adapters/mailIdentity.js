import knex from './knex.js';

export async function create(mail, password) {
  const now = Date.now();
  const [ userId ] = await knex
  .insert({
    createAt: now,
    lastLoginAt: now,
  }, ['id'])
  .into('users');

  await knex
  .insert({
    userId,
    mail,
    password,
  })
  .into('mailIdentities');

  return {
    userId,
    createAt: now,
    lastLoginAt: now,
    mail,
    password,
  };
}

export async function findByMail(mail) {
  const users = await knex
  .select(
    'u.id as userId', 'u.createAt', 'u.lastLoginAt',
    'm.mail', 'm.password'
  )
  .from('users as u')
  .where('m.mail', mail)
  .innerJoin('mailIdentities as m', 'u.id', '=', 'm.userId');

  return users.length > 0 ? users[0] : null;
}

export async function findByUserId(userId) {
  const users = await knex
  .select(
    'u.id as userId', 'u.createAt', 'u.lastLoginAt',
    'm.mail', 'm.password'
  )
  .from('users as u')
  .where('m.userId', userId)
  .innerJoin('mailIdentities as m', 'u.id', '=', 'm.userId');

  return users.length > 0 ? users[0] : null;
}
