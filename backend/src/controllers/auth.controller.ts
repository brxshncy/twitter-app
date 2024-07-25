import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const generateJwtToken = (id: mongoose.Types.ObjectId) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });

  return token;
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { userNameOrEmail, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: userNameOrEmail }, { username: userNameOrEmail }],
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(403).json({
        message: "Invalid Username and Password combination",
      });
    }

    if (user && passwordMatch) {
      const token = generateJwtToken(user._id);
      return res.status(203).json({ user, token });
    } else {
      return res.status(403).json({
        message: "Invalid Credentials",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, username, name, password, profileImageUrl } = req.body;

    const userExist = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (userExist) {
      return res.status(403).json({
        message: "Username or Email has already been taken.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      email,
      username,
      name,
      password: hashedPassword,
      profileImageUrl,
    });

    if (user) {
      await user.save();
      res.status(203).json(user);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.cookie("jwt", { maxAge: 0 });
    res.status(200).json({
      message: "Log out successfully!",
    });
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
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
};
