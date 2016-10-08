import assert from 'assert';

import { findByMail, create } from '../models\/mailIdentity.js';
import { compare, encrypt } from '../models\/cryptoPassword.js';

export async function loginMailIdentity(mail, password) {
  const user = await findByMail(mail);
  assert.ok(user, 'User not found');

  const isPasswordCorrect = await compare(password, user.password);
  assert.ok(isPasswordCorrect, 'Invalid password');

  return user;
}

export async function registMailIdentity(mail, password) {
  const user = await findByMail(mail);
  assert.deepEqual(user, null, 'User exist');
  const hash = await encrypt(password);
  return await create(mail, hash);
}
