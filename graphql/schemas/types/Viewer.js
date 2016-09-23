import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLList
} from 'graphql';

const Viewer = new GraphQLObjectType({
  name: 'Viewer',
  fields: {
    profile: {
      type: GraphQLInt,
      args: {
        profileId: { type: GraphQLInt }
      },
      resolve(_, { profileId }) {
        console.log(_)
        return profileId;
      }
    }
  }
});

export default Viewer;
