import joi from 'joi';

export default function validate(...schemas) {
  return function (target, key, descriptor) {
    return {
      ...descriptor,
      value(...args) {
        const validArgs = schemas.map((schema, index) => {
          if (!schema) {
            return undefined;
          } else if (typeof schema.validate !== 'function') {
            schema = joi.object(schema).default();
          }

          const { error, value } = joi.validate(args[index], schema, {
            stripUnknown: true,
            allowUnknown: true
          });

          if (error) {
            throw error;
          }

          return value;
        });

        // concat other argumenst
        const allArgs = validArgs.concat(args.slice(schemas.length));
        return descriptor.value.apply(this, allArgs);
      }
    };
  }
}
