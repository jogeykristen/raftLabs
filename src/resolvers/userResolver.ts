// // import { GraphQLString as GQLString, GraphQLNonNull } from "graphql";
// // import User, { IUser } from "../models/User";
// // import bcrypt from "bcrypt"; // Ensure bcrypt is installed
// // import jwt from "jsonwebtoken";
// // import { userValidationSchema } from "../validation/userValidation";

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

import { GraphQLString as GQLString, GraphQLNonNull } from "graphql";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userValidationSchema } from "../validation/userValidation";
import { Request } from "express"; // for typing context

const userResolver = {
  register: {
    type: GQLString,
    args: {
      username: { type: new GraphQLNonNull(GQLString) },
      password: { type: new GraphQLNonNull(GQLString) },
    },
    async resolve(
      _: any,
      { username, password }: { username: string; password: string }
    ) {
      const { error } = userValidationSchema.validate({ username, password });
      if (error) throw new Error(error.details[0].message);

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, password: hashedPassword });
      await user.save();
      return "User registered successfully";
    },
  },
  login: {
    type: GQLString,
    args: {
      username: { type: new GraphQLNonNull(GQLString) },
      password: { type: new GraphQLNonNull(GQLString) },
    },
    async resolve(
      _: any,
      { username, password }: { username: string; password: string }
    ) {
      const { error } = userValidationSchema.validate({ username, password });
      if (error) throw new Error(error.details[0].message);

      const user = await User.findOne({ username });
      if (!user) throw new Error("User not found");
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Invalid credentials");

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "1h" }
      );
      return token;
    },
  },
  get: {
    type: GQLString,
    async resolve(_: any, args: any, context: { user: { id: string } }) {
      // Define context type here
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      const user = await User.findById(context.user.id);
      if (!user) throw new Error("User not found");

      return user.username; // or return other user details as needed
    },
  },
};

export default userResolver;
