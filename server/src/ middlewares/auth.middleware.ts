import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../models/user.model";
import { ObjectId } from "mongodb";

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
export const protectedRoutes = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let token;

    const { authorization } = req.headers;

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new Error("JWT Secret is not set");
    }

    if (!authorization || !authorization.startsWith("Bearer")) {
        return res.status(401).json({
            message: "Unauthorized access",
        });
    }

    token = authorization.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access - No Token",
        });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret) as DecodedToken;
        const user = (await User.findById(decoded.id).select(
            "-passsword"
        )) as IUser;

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        req.user = user;
        next();
    } catch (error) {}
};
