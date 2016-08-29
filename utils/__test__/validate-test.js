import { expect } from 'chai';
import joi from 'joi';

import validate from '../validate';

describe('validate', () => {

  it('should parse arguments into expected values, or pass extra value', () => {
    const target = {
      @validate(
        joi.string(),
        joi.number(),
        {
          numProp: joi.number(),
          strProp: joi.string()
        }
      )
      func(...args) {
        return args;
      }
    };

    const stringValue = 'to be a string';
    const numberValue = 10;
    const objectValue = {
      numProp: 10,
      strProp: 'string property'
    };
    const anyValue = ['1', '2'];

    const results = target.func(stringValue, numberValue, objectValue, anyValue);

    expect(results).to.be.deep.equal([stringValue, numberValue, objectValue, anyValue]);
  });

  it('should throw error if any invalid parameters', () => {
    const target = {
      @validate(
        joi.string()
      )
      func(...args) {
        return args;
      },

      @validate({
        prop: joi.string()
      })
      func2(...args) {
        return args;
      },

      @validate(
        joi.string()
      )
      func3(...args) {
        return args;
      }
    };

    expect(() => target.func(1)).to.throw();
    expect(() => target.func2({ prop: 1})).to.throw();
    expect(() => target.func3('string', 3)).to.not.throw();
  });

});
