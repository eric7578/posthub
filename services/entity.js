import joi from 'joi';

import validate from '../utils/validate';
import { Entity, User, Permission } from '../models';

export default {

  @validate({
    title: joi.string().default('Untitled').label('title')
  })
  async createRoot(props) {
    const entity = await Entity.create({
      title: props.title,
      level: 0
    });

    return entity.toResponseJSON();
  },

  @validate({
    parentId: joi.number().required().label('parentId'),
    title: joi.string().default('Untitled').label('title')
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

  @validate(joi.number().required().label('parentId'))
  async getChildren(parentId) {
    const entry = await Entity.findById(parentId);
    if (!entry) {
      throw new Error('Entity not found');
    }

    const childrenSet = {};
    const children = await Entity.findAll({
      where: {
        parentId: entry.id
      }
    });

    children.forEach(child => childrenSet[child.id] = child.toResponseJSON());
    return childrenSet;
  },

  @validate(joi.number().required().label('entryId'))
  async getFlattenTree(entryId) {
    const entry = await Entity.findById(entryId);
    if (!entry) {
      throw new Error('Entity not found');
    }

    const tree = {
      root: entry.toResponseJSON()
    };

    let cursorEntity = entry;
    let entities = [];
    do {
      const subEntities = await Entity.findAll({
        where: {
          parentId: cursorEntity.id
        }
      });

      subEntities.forEach(subEntity => {
        tree[subEntity.id] = subEntity.toResponseJSON()
      });

      entities = entities.concat(subEntities);
      cursorEntity = entities.pop();
    } while (!!cursorEntity)

    return tree;
  },

  @validate({
    entityId: joi.number().required().label('entityId'),
    userId: joi.number().required().label('userId'),
    permission: joi.number().default(0).label('permission')
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

};
