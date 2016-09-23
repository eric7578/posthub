import { GraphQLSchema } from 'graphql';
import Query from './types/Query.js';

const schema = new GraphQLSchema({
  query: Query,
});

export default schema;
