import express from "express";
import { graphqlHTTP } from "express-graphql";
import schema from "./schema/schema";
import connectDB from "./config/db";
import { authMiddleware } from "./middleware/auth";
import { errorHandler } from "./middleware/errorHandler";
import { Request } from "express";
import { any } from "joi";
import "dotenv/config";

const app = express();
connectDB();

app.use(express.json());
app.use(authMiddleware);

app.use(
  "/graphql",
  graphqlHTTP((req, res) => ({
    schema,
    graphiql: true,
  }))
);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/graphql`);
});
