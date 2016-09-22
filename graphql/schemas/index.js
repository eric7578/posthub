import { readdirSync, readFileSync } from 'fs';
import { extname, join } from 'path';
import { buildSchema } from 'graphql';

const graphqlSchemas = [];
readdirSync(__dirname)
  .filter(file => extname(file) === '.graphql')
  .forEach(file => {
    const filepath = join(__dirname, file);
    const schema = readFileSync(filepath);
    graphqlSchemas.push(schema);
  });

export default buildSchema(graphqlSchemas.join(''));
