"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const userResolver_1 = __importDefault(require("../resolvers/userResolver"));
const RootMutation = new graphql_1.GraphQLObjectType({
    name: "Mutation",
    fields: {
        register: userResolver_1.default.register,
        login: userResolver_1.default.login,
    },
});
const RootQuery = new graphql_1.GraphQLObjectType({
    name: "Query",
    fields: {
        get: userResolver_1.default.get,
    },
});
const schema = new graphql_1.GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation,
});
exports.default = schema;
