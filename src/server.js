"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_graphql_1 = require("express-graphql");
const schema_1 = __importDefault(require("./schema/schema"));
const db_1 = __importDefault(require("./config/db"));
const auth_1 = require("./middleware/auth");
const errorHandler_1 = require("./middleware/errorHandler");
require("dotenv/config");
const app = (0, express_1.default)();
(0, db_1.default)();
app.use(express_1.default.json());
app.use(auth_1.authMiddleware);
app.use("/graphql", (0, express_graphql_1.graphqlHTTP)((req, res) => ({
    schema: schema_1.default,
    graphiql: true,
})));
app.use(errorHandler_1.errorHandler);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/graphql`);
});
