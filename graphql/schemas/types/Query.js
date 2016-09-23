import {
  GraphQLObjectType,
  GraphQLString
} from 'graphql';

import Viewer from './Viewer.js';

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    viewer: {
      type: Viewer,
      args: {
        token: { type: GraphQLString }
      },
      resolve(_, { token }) {
        if (token === 'valid') {
          return Promise.resolve('hahaha');
        } else {
          const err = new Error('you shall not pass');
          return Promise.reject(err);
        }
      }
    }
  }
});

export default Query;
