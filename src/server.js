"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./types/global");
const express_1 = __importDefault(require("express"));
const express_graphql_1 = require("express-graphql");
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const schema_1 = __importDefault(require("./schema/schema"));
const db_1 = __importDefault(require("./config/db"));
const auth_1 = require("./middleware/auth"); // your existing auth middleware
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
(0, db_1.default)();
// Create HTTP server to attach Socket.IO
const server = http_1.default.createServer(app);
// Initialize Socket.IO
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*", // Allow all origins (for production, set a specific URL)
        methods: ["GET", "POST"],
    },
});
// Socket.IO connection event
io.on("connection", (socket) => {
    console.log("A user connected");
    // JWT authentication for WebSocket connections
    socket.use((packet, next) => {
        const token = socket.handshake.query.token;
        // Ensure token is a string
        if (!token || Array.isArray(token)) {
            return next(new Error("Authorization token is required and should be a string"));
        }
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "secret", (err, decoded) => {
            if (err) {
                return next(new Error("Invalid token"));
            }
            // Type guard to ensure decoded is a valid User object
            if (decoded && typeof decoded !== "string") {
                socket.user = decoded; // Attach user to socket
                next();
            }
            else {
                return next(new Error("Invalid token structure"));
            }
        });
    });
    // Example of broadcasting a message to a specific room
    socket.on("join_room", (roomId) => {
        var _a;
        socket.join(roomId); // Join the room
        console.log(`User ${(_a = socket.user) === null || _a === void 0 ? void 0 : _a.id} joined room ${roomId}`);
    });
    // Example of sending a message to a room
    socket.on("send_message", (roomId, message) => {
        io.to(roomId).emit("receive_message", message);
        console.log(`Message sent to room ${roomId}: ${message}`);
    });
    // Handle user disconnect
    socket.on("disconnect", () => {
        var _a;
        console.log(`User ${(_a = socket.user) === null || _a === void 0 ? void 0 : _a.id} disconnected`);
    });
});
app.use(express_1.default.json());
app.use(auth_1.authMiddleware); // Ensure this is before the GraphQL route
// GraphQL route
app.use("/graphql", (0, express_graphql_1.graphqlHTTP)((req, res) => ({
    schema: schema_1.default,
    graphiql: true,
    // context: { user: req.user }, // Pass the user from req to context for GraphQL
})));
// Error handling middleware
app.use(errorHandler_1.errorHandler);
// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/graphql`);
});
