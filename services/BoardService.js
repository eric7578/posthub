import joi from 'joi';

import validate from '../utils/validate';
import { Entity } from '../models';

export default class BoardService {

  @validate({
    title: joi.string().default('New Board')
  })
  async create(boardProps) {
    const entity = await Entity.create({
      title: boardProps.title,
      level: 0
    });

    return entity.toResponseJSON();
  }

}
