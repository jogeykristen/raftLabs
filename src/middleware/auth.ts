import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface User {
  id: string;
  username: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    req.path === "/graphql" &&
    (req.body.query.includes("register") || req.body.query.includes("login"))
  ) {
    return next();
  }

  const token = req.headers["authorization"];
  if (!token) return res.status(401).send("Access denied");

  console.log("Token received:", token);

  const tokenString = token.split(" ")[1];

  if (!tokenString) {
    return res.status(401).send("Token is missing");
  }

  jwt.verify(
    tokenString,
    process.env.JWT_SECRET || "secret",
    (err, decoded) => {
      if (err) {
        console.error("Token verification error:", err);
        return res.status(403).send("Invalid token");
      }

      if (decoded && typeof decoded !== "string") {
        const user = decoded as User;
        req.user = user;
      }
      next();
    }
  );
};
