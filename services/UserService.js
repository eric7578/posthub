import joi from 'joi';

import validate from '../utils/validate';
import { User, MailIdentity } from '../models';

export default class UserService {

  @validate({
    mail: joi.string().email().required(),
    password: joi.string().required().alphanum(),
    displayName: joi.string().required()
  })
  async regist(registData) {
    let user = await MailIdentity.findByMail(registData.mail);
    if (user !== null) {
      throw new Error('User exist');
    }

    user = User.build({
      username: registData.displayName,
      lastLoginAt: Date.now(),
      displayName: registData.displayName
    });
    user.refreshToken();
    await user.save();

    const identity = await MailIdentity.create({
      mail: registData.mail,
      password: registData.password,
      userId: user.id
    });

    return user.toResponseJSON(identity);
  }

  @validate({
    mail: joi.string().email().required(),
    password: joi.string().required().alphanum()
  })
  async login(loginData) {
    const identity = await MailIdentity.findByMail(loginData.mail);
    if (identity === null) {
      throw new Error('User not found');
    } else if (!identity.checkPassword(loginData.password)) {
      throw new Error('Invalid password');
    }

    const user = await identity.getUser();
    user.lastLoginAt = Date.now();
    user.refreshToken();
    await user.save();

    return user.toResponseJSON(identity);
  }

}
