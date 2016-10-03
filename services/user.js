import assert from 'assert';

import { createWithMail, findByMail, encrypt } from '../models/users.js';

export async function regist(mail, pwd) {
  const user = await findByMail(mail);
  assert.equal(user, null, 'User exist');
  return await createWithMail(mail, pwd);
}

export async function login(mail, pwd) {
  const user = await findByMail(mail);
  assert.ok(user, 'User not found');

  const { password, salt } = user;
  const encryptPassword = encrypt(pwd, salt).password;
  assert.equal(encryptPassword, password, 'Invalid password');
  return user;
}
