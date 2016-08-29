import joi from 'joi';

export default function validate(...schemas) {
  const validators = schemas.map(schema => {
    if (typeof schema.validate === 'function') {
      return schema;
    } else if (typeof schema === 'object') {
      return joi.object(schema).default();
    } else {
      return joi.any().allow(schema);
    }
  });

  return function (target, key, descriptor) {
    return {
      ...descriptor,
      value(...args) {
        const extraArgs = args.slice(validators.length);
        const validArgs = validators.map((validator, index) => {
          const { error, value } = joi.validate(args[index], validator, {
            allowUnknown: true
          });

          if (error) {
            throw error;
          }

          return value;
        });

        // concat other argumenst
        return descriptor.value.apply(this, validArgs.concat(extraArgs));
      }
    };
  }
}
