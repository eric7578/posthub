import { createHash } from 'crypto';
import assert from 'assert';

import knex from './knex.js';

export function encrypt(password, salt) {
  if (arguments.length === 1) {
    // create salt
    salt = Math.floor(Math.random() * 10000).toString(8);
  }

  const sha1 = createHash('sha1');
  sha1.update(salt);
  sha1.update(password);

  return {
    salt,
    password: sha1.digest('hex'),
  };
}

export async function createWithMail(mail, pwd) {
  const now = Date.now();

  const [ userId ] = await knex
  .insert({
    createAt: now,
    lastLoginAt: now,
  }, ['id'])
  .into('users');

  const { salt, password } = encrypt(pwd);
  await knex
  .insert({
    userId,
    mail,
    password,
    salt,
  }, ['mail', 'password', 'salt'])
  .into('mailIdentities');

  return {
    userId,
    createAt: now,
    lastLoginAt: now,
    mail,
    password,
    salt,
  };
}

export async function findByMail(mail) {
  assert.ok(mail, 'mail should be provided');

  const users = await knex
  .select(
    'u.id as userId', 'u.createAt', 'u.lastLoginAt',
    'm.mail', 'm.password', 'm.salt'
  )
  .from('users as u')
  .where('m.mail', mail)
  .innerJoin('mailIdentities as m', 'u.id', '=', 'm.userId');

  return users.length > 0 ? users[0] : null;
}

export async function findByUserId(userId) {
  assert.ok(userId, 'userId should be provided');

  const users = await knex
  .select(
    'u.id as userId', 'u.createAt', 'u.lastLoginAt',
    'm.mail', 'm.password', 'm.salt'
  )
  .from('users as u')
  .where('m.userId', userId)
  .innerJoin('mailIdentities as m', 'u.id', '=', 'm.userId');

  return users.length > 0 ? users[0] : null;
}
