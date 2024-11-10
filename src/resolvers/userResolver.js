"use strict";
// // import { GraphQLString as GQLString, GraphQLNonNull } from "graphql";
// // import User, { IUser } from "../models/User";
// // import bcrypt from "bcrypt"; // Ensure bcrypt is installed
// // import jwt from "jsonwebtoken";
// // import { userValidationSchema } from "../validation/userValidation";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// // const userResolver = {
// //   register: {
// //     type: GQLString,
// //     args: {
// //       username: { type: new GraphQLNonNull(GQLString) },
// //       password: { type: new GraphQLNonNull(GQLString) },
// //     },
// //     async resolve(
// //       _: any,
// //       { username, password }: { username: string; password: string }
// //     ) {
// //       // Validate input
// //       const { error } = userValidationSchema.validate({ username, password });
// //       if (error) throw new Error(error.details[0].message);
// //       const hashedPassword = await bcrypt.hash(password, 10);
// //       const user = new User({ username, password: hashedPassword });
// //       await user.save();
// //       return "User  registered successfully";
// //     },
// //   },
// //   login: {
// //     type: GQLString,
// //     args: {
// //       username: { type: new GraphQLNonNull(GQLString) },
// //       password: { type: new GraphQLNonNull(GQLString) },
// //     },
// //     async resolve(
// //       _: any,
// //       { username, password }: { username: string; password: string }
// //     ) {
// //       // Validate input
// //       const { error } = userValidationSchema.validate({ username, password });
// //       if (error) throw new Error(error.details[0].message);
// //       const user = await User.findOne({ username });
// //       if (!user) throw new Error("User  not found");
// //       const isMatch = await bcrypt.compare(password, user.password);
// //       if (!isMatch) throw new Error("Invalid credentials");
// //       const token = jwt.sign(
// //         { id: user.id },
// //         process.env.JWT_SECRET || "secret",
// //         { expiresIn: "1h" }
// //       );
// //       return token;
// //     },
// //   },
// //   get: {
// //     type: GQLString,
// //     args: {
// //       id: { type: new GraphQLNonNull(GQLString) },
// //     },
// //     async resolve(_: any, { id }: { id: string }, context: any) {
// //       const user = await User.findById(id);
// //       if (!user) throw new Error("User  not found");
// //       return user.username;
// //     },
// //   },
// // };
// // export default userResolver;
// import { GraphQLString as GQLString, GraphQLNonNull } from "graphql";
// import User from "../models/User";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { userValidationSchema } from "../validation/userValidation";
// const userResolver = {
//   register: {
//     type: GQLString,
//     args: {
//       username: { type: new GraphQLNonNull(GQLString) },
//       password: { type: new GraphQLNonNull(GQLString) },
//     },
//     async resolve(
//       _: any,
//       { username, password }: { username: string; password: string }
//     ) {
//       const { error } = userValidationSchema.validate({ username, password });
//       if (error) throw new Error(error.details[0].message);
//       const hashedPassword = await bcrypt.hash(password, 10);
//       const user = new User({ username, password: hashedPassword });
//       await user.save();
//       return "User  registered successfully";
//     },
//   },
//   login: {
//     type: GQLString,
//     args: {
//       username: { type: new GraphQLNonNull(GQLString) },
//       password: { type: new GraphQLNonNull(GQLString) },
//     },
//     async resolve(
//       _: any,
//       { username, password }: { username: string; password: string }
//     ) {
//       const { error } = userValidationSchema.validate({ username, password });
//       if (error) throw new Error(error.details[0].message);
//       const user = await User.findOne({ username });
//       if (!user) throw new Error("User  not found");
//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) throw new Error("Invalid credentials");
//       const token = jwt.sign(
//         { id: user.id },
//         process.env.JWT_SECRET || "secret",
//         { expiresIn: "1h" }
//       );
//       return token;
//     },
//   },
//   get: {
//     type: GQLString, // Adjust the return type as needed, e.g., a UserType if you have one defined
//     async resolve(_: any, args: any, context: any) {
//       if (!context.user) {
//         throw new Error("Not authenticated");
//       }
//       const user = await User.findById(context.user.id);
//       if (!user) throw new Error("User not found");
//       return user.username; // or return other user details as needed
//     },
//   },
// };
// export default userResolver;
const graphql_1 = require("graphql");
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userValidation_1 = require("../validation/userValidation");
const userResolver = {
    register: {
        type: graphql_1.GraphQLString,
        args: {
            username: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            password: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        },
        resolve(_1, _a) {
            return __awaiter(this, arguments, void 0, function* (_, { username, password }) {
                const { error } = userValidation_1.userValidationSchema.validate({ username, password });
                if (error)
                    throw new Error(error.details[0].message);
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                const user = new User_1.default({ username, password: hashedPassword });
                yield user.save();
                return "User registered successfully";
            });
        },
    },
    login: {
        type: graphql_1.GraphQLString,
        args: {
            username: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            password: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        },
        resolve(_1, _a) {
            return __awaiter(this, arguments, void 0, function* (_, { username, password }) {
                const { error } = userValidation_1.userValidationSchema.validate({ username, password });
                if (error)
                    throw new Error(error.details[0].message);
                const user = yield User_1.default.findOne({ username });
                if (!user)
                    throw new Error("User not found");
                const isMatch = yield bcrypt_1.default.compare(password, user.password);
                if (!isMatch)
                    throw new Error("Invalid credentials");
                const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
                return token;
            });
        },
    },
    get: {
        type: graphql_1.GraphQLString,
        resolve(_, args, context) {
            return __awaiter(this, void 0, void 0, function* () {
                // Define context type here
                if (!context.user) {
                    throw new Error("Not authenticated");
                }
                const user = yield User_1.default.findById(context.user.id);
                if (!user)
                    throw new Error("User not found");
                return user.username; // or return other user details as needed
            });
        },
    },
};
exports.default = userResolver;
