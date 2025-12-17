import type { Express, RequestHandler } from "express";

/**
 * Authentication setup stub.
 * FUTURE WORK - POST HACKATHON: Implement full authentication system
 * (e.g., Replit Auth, OAuth, or JWT-based authentication)
 */
export async function setupAuth(app: Express) {
  // Auth is currently disabled. Protected endpoints will return 401.
  return;
}

/**
 * Authentication middleware stub.
 * Returns 401 for any protected route until authentication is implemented.
 */
export const isAuthenticated: RequestHandler = (_req, res) => {
  return res.status(401).json({ message: "Authentication required" });
};
