import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { errorResponse } from "../utils/apiResponse.js";

export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return errorResponse(res, "Missing or malformed Authorization header", 401);
  }

  try {
    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, env.jwtSecret);

    const user = await User.findById(payload.userId).populate("roles");
    if (!user) {
      return errorResponse(res, "Authenticated user not found", 401);
    }

    req.user = user;
    next();
  } catch {
    return errorResponse(res, "Invalid or expired token", 401);
  }
}