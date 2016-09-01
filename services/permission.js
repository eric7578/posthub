import joi from 'joi';

import validate from '../utils/validate';
import { set } from '../utils/bitop';
import { Entity, User, Permission } from '../models';

export default {
  @validate({
    entityId: joi.number().required().label('entityId'),
    userId: joi.number().required().label('userId'),
    permission: joi.number().default(0).label('permission'),
    sample: joi.array().items(joi.number()).label('sample')
  })
  async setPermission(permissionProps) {
    const [entity, user] = await Promise.all([
      Entity.findById(permissionProps.entityId),
      User.findById(permissionProps.userId)
    ]);

    if (!entity) {
      throw new Error('Entity not found');
    } else if (!user) {
      throw new Error('User not found');
    }

    let { permission } = permissionProps;
    if (!permission && !permissionProps.sample) {
      throw new Error('Either permission or sample should be provided');
    } else if (!!permissionProps.sample) {
      permission = set.call(null, 0, ...permissionProps.sample);
    }

    const [permissionModel, created] = await Permission.findOrCreate({
      where: {
        entityId: entity.id,
        userId: user.id
      },
      defaults: {
        auth: permission
      }
    });

    if (!created && permissionModel.auth !== permission) {
      permissionModel.auth = permission;
      await permissionModel.save();
    }

    return true;
  },

  @validate({
    entityId: joi.number().required().label('entityId'),
    userId: joi.number().required().label('userId'),
    permission: joi.number().label('permission'),
    sample: joi.array().items(joi.number()).label('sample')
  })
  async hasPermission(prop) {
    if (!prop.permission && !prop.sample) {
      throw new Error('Either permission or sample should be provided');
    }

    const currentPermission = await Permission.findOne({
      where: {
        entityId: prop.entityId,
        userId: prop.userId
      }
    });

    if (!currentPermission) {
      return false;
    } else {
      const test = prop.permission || set.call(null, 0, ...prop.sample);
      return (test & currentPermission.auth) === test;
    }
  },

  @validate(joi.number().required().label('entityId'))
  async getParticipants(entityId) {
    const permissions = await Permission.findAll({
      where: {
        entityId
      }
    });

    const participants = [];
    for (let i = 0; i < permissions.length; i++) {
      const permission = permissions[i];
      const user = await permission.getUser();
      participants[i] = {
        ...user.toResponseJSON(),
        permission: permission.auth
      };
    }

    return participants;
  }
}
