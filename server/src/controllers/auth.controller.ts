import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateJwtToken = (id: mongoose.Types.ObjectId) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: "30d",
    });

    return token;
};
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { usernameOrEmail, password } = req.body;

        const user = await User.findOne({
            $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
        });

        if (!user) {
            return res.status(403).json({
                message: "User not found",
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(403).json({
                message: "Invalid Username or Email and Password Combination",
            });
        }

        if (user && isPasswordMatch) {
            const token = generateJwtToken(user._id);
            return res.status(203).json({
                user,
                token,
            });
        } else {
            return res.status(403).json({
                message: "Invalid Credentials",
            });
        }
    } catch (error) {}
};

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { email, username, password, name } = req.body;

        const isUserAlreadyRegistered = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (isUserAlreadyRegistered) {
            return res.status(403).json({
                message: "Username or Email already registered.",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            email,
            name,
            password: hashedPassword,
            username,
            // profileImageUrl,
        });

        if (user) {
            await user.save();
            res.status(203).json(user);
        }
    } catch (error) {
        console.log("Error in register method auth.controller", error);
        res.status(500).json({
            message: "Something went wrong!",
        });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong!",
        });
    }
};

export const getMe = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                message: "User not found!",
            });
        }
        res.status(200).json(user);
    } catch (error) {}
};
