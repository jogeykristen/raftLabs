import "./types/global";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import http from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import schema from "./schema/schema";
import connectDB from "./config/db";
import { authMiddleware } from "./middleware/auth";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket: Socket) => {
  console.log("A user connected");

  socket.use((packet, next) => {
    const token = socket.handshake.query.token as string | undefined;

    if (!token || Array.isArray(token)) {
      return next(
        new Error("Authorization token is required and should be a string")
      );
    }

    jwt.verify(token, process.env.JWT_SECRET || "secret", (err, decoded) => {
      if (err) {
        return next(new Error("Invalid token"));
      }

      if (decoded && typeof decoded !== "string") {
        socket.user = decoded as { id: string; username: string };
        next();
      } else {
        return next(new Error("Invalid token structure"));
      }
    });
  });

  socket.on("join_room", (roomId: string) => {
    socket.join(roomId);
    console.log(`User ${socket.user?.id} joined room ${roomId}`);
  });

  socket.on("send_message", (roomId: string, message: string) => {
    io.to(roomId).emit("receive_message", message);
    console.log(`Message sent to room ${roomId}: ${message}`);
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.user?.id} disconnected`);
  });
});

app.use(express.json());
app.use(authMiddleware);

app.use(
  "/graphql",
  graphqlHTTP((req, res) => ({
    schema,
    graphiql: true,
    // context: { user: req.user },
  }))
);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/graphql`);
});
