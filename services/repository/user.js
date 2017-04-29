const knex = require('./knex')

exports.create = async (mail, hashPassword) => {
  const now = Date.now()
  const [userId] = await knex
  .insert({
    createAt: now,
    lastLoginAt: now
  })
  .into('users')

  await knex
  .insert({
    userId,
    mail,
    password: hashPassword
  })
  .into('mailIdentities')

  return {
    id: userId,
    createAt: now,
    lastLoginAt: now,
    mail,
    password: hashPassword
  }
}

exports.findByMail = async mail => {
  const users = await knex
  .select(
    'u.id as userId', 'u.createAt', 'u.lastLoginAt',
    'm.mail', 'm.password'
  )
  .from('users as u')
  .where('m.mail', mail)
  .innerJoin('mailIdentities as m', 'u.id', '=', 'm.userId')

  if (!users.length) {
    return null
  }

  return {
    id: users[0].userId,
    createAt: users[0].createAt,
    lastLoginAt: users[0].lastLoginAt,
    mail: users[0].mail,
    password: users[0].password
  }
}
