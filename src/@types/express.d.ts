// src/@types/express.d.ts
import { Request } from "express";

interface User {
  id: string;
  username: string;
  // Add other user properties as necessary
}

declare global {
  namespace Express {
    interface Request {
      user?: User; // Extend the Request type to include the `user` property
    }
  }
}
