import joi from 'joi';

import validate from '../utils/validate';
import { Entity, User, Permission } from '../models';

export default {

  @validate({
    title: joi.string().default('Untitled')
  })
  async createRoot(props) {
    const entity = await Entity.create({
      title: props.title,
      level: 0
    });

    return entity.toResponseJSON();
  },

  @validate({
    parentId: joi.number().required(),
    title: joi.string().default('Untitled')
  })
  async createSub(props) {
    const parent = await Entity.findById(props.parentId);
    if (!parent) {
      throw new Error('Parent not found');
    }

    const entity = await Entity.create({
      parentId: parent.id,
      title: props.title,
      level: parent.level + 1
    });

    return entity.toResponseJSON();
  },

  @validate({
    entityId: joi.number().required(),
    userId: joi.number().required(),
    permission: joi.number().default(0)
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

    await Permission.findOrCreate({
      where: {
        entityId: entity.id,
        userId: user.id
      },
      defaults: {
        auth: permissionProps.permission
      }
    });

    return true;
  },

  @validate(joi.number().required())
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

};
