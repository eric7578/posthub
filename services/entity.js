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
  }

};
