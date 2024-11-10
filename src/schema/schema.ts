import { GraphQLSchema, GraphQLObjectType } from "graphql";
import userResolver from "../resolvers/userResolver";

const RootMutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    register: userResolver.register,
    login: userResolver.login,
  },
});

const RootQuery = new GraphQLObjectType({
  name: "Query",
  fields: {
    get: userResolver.get,
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});

export default schema;
