import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../models/user.model";

interface DecodedToken extends JwtPayload {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

export const protectedRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  const jwtSecret = process.env.JWT_SECRET as string;

  if (!jwtSecret) {
    throw new Error("JWT Secret must be set!");
  }

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized access",
    });
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized access - No token",
    });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as DecodedToken;

    const user = (await User.findById(decoded.id).select("-password")) as IUser;

    if (!user) {
      return res.status(401).json({
        message: "User not found!",
      });
    }

    req.user = user;
    next();
  } catch (error) {}
};
