import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const generateJwtToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
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
      return res.status(203).json({
        user,
        token: generateJwtToken(user._id),
      });
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

    await user.save();
    res.status(203).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
};
