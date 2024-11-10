"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    // Skip authentication for register and login routes
    if (req.path === "/graphql" &&
        (req.body.query.includes("register") || req.body.query.includes("login"))) {
        return next();
    }
    const token = req.headers["authorization"];
    if (!token)
        return res.status(401).send("Access denied");
    // Log the token to verify it's being passed correctly
    console.log("Token received:", token);
    // Remove "Bearer " part and keep only the token
    const tokenString = token.split(" ")[1];
    // If the token string is missing, return an error
    if (!tokenString) {
        return res.status(401).send("Token is missing");
    }
    // Verify the token
    jsonwebtoken_1.default.verify(tokenString, process.env.JWT_SECRET || "secret", (err, decoded) => {
        if (err) {
            console.error("Token verification error:", err);
            return res.status(403).send("Invalid token");
        }
        // Ensure decoded is a valid object
        if (decoded && typeof decoded !== "string") {
            req.user = decoded;
        }
        next();
    });
};
exports.authMiddleware = authMiddleware;
