"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    if (req.path === "/graphql" &&
        (req.body.query.includes("register") || req.body.query.includes("login"))) {
        return next();
    }
    const token = req.headers["authorization"];
    if (!token)
        return res.status(401).send("Access denied");
    console.log("Token received:", token);
    const tokenString = token.split(" ")[1];
    if (!tokenString) {
        return res.status(401).send("Token is missing");
    }
    jsonwebtoken_1.default.verify(tokenString, process.env.JWT_SECRET || "secret", (err, decoded) => {
        if (err) {
            console.error("Token verification error:", err);
            return res.status(403).send("Invalid token");
        }
        // Type guard to check if decoded is a valid User object
        if (decoded && typeof decoded !== "string") {
            const user = decoded; // Now we can safely assume that `decoded` is a `User` type
            req.user = user; // Attach user to request object
        }
        next();
    });
};
exports.authMiddleware = authMiddleware;
