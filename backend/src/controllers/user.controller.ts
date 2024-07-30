import { Request, Response } from "express";
import User from "../models/user.model";
import mongoose from "mongoose";
import { Notification } from "../models/notification.model";
import bcrypt from "bcryptjs";
import {
  destroyImageCloudinary,
  uploadImageToCloudinary,
} from "../utils/cloudinary";

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({
      username: req.params.username,
    });

    if (!user) {
      res.status(404).json({
        message: "User not found!",
      });
    }

    res.status(200).json(user);
  } catch (error: any) {
    console.log("Error In get user profile", error);
    res.status(500).json({
      error: error.message,
    });
  }
};

export const getSuggestedUsers = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const userFollowedByMe = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      { $sample: { size: 10 } },
    ]);

    const filteredUsers = users.filter(
      (user) => !userFollowedByMe?.following.includes(user._id)
    );

    const suggestedUsers = filteredUsers.slice(0, 4);

    res.status(200).json(suggestedUsers);
  } catch (error: any) {
    console.log("Error In getSuggestedUsers", error);
    res.status(500).json({
      error: error.message,
    });
  }
};

export const toggleFollowUser = async (req: Request, res: Response) => {
  try {
    // extract current user logged in
    const currentUser = await User.findById(req.user._id);
    // extract user to follow
    const { id } = req.params;
    const userToFollow = await User.findById(id);
    const ObjectId = mongoose.Types.ObjectId;

    if (!userToFollow) {
      return res.status(404).json({
        error: "User not found!",
      });
    }

    if (new ObjectId(id).equals(req.user._id)) {
      return res.status(400).json({
        error: "You can't follow/unfollow yourself",
      });
    }

    if (!currentUser || !userToFollow) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Check if current user already followed the user follow
    const isFollowing = currentUser?.following.includes(userToFollow._id);

    if (isFollowing) {
      // If user already followed, removed the current user id to the followers of the userToFollow
      await User.findByIdAndUpdate(userToFollow._id, {
        $pull: { followers: currentUser._id },
      });

      await User.findByIdAndUpdate(currentUser._id, {
        $pull: { following: userToFollow._id },
      });

      res.status(200).json({
        message: "User unfollowed",
      });
    } else {
      await User.findByIdAndUpdate(userToFollow._id, {
        $push: { followers: currentUser._id },
      });

      await User.findByIdAndUpdate(currentUser._id, {
        $push: { following: userToFollow._id },
      });

      const newNotification = new Notification({
        type: "follow",
        from: currentUser._id,
        to: userToFollow._id,
      });

      await newNotification.save();

      res.status(200).json({
        message: "User followed",
      });
    }
  } catch (error: any) {
    console.log("Error In toggleFollowUser", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { name, email, username, currentPassword, newPassword, bio } =
      req.body;
    let profileImageFile;
    let coverImageFile;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (files) {
      profileImageFile = files["profileImageUrl"]
        ? files["profileImageUrl"][0]
        : null;
      coverImageFile = files["coverImageUrl"]
        ? files["coverImageUrl"][0]
        : null;
    }

    const currentUser = await User.findById(req.user._id);

    if (!currentUser) {
      return res.status(404).json({
        error: `User with username of ${req.params.username} not found!`,
      });
    }

    if (
      (!newPassword && currentPassword) ||
      (!currentPassword && newPassword)
    ) {
      return res.status(400).json({
        error: "Please provide both current password and new password",
      });
    }

    if (newPassword && currentPassword) {
      const isMatch = await bcrypt.compare(
        currentPassword,
        currentUser.password
      );

      if (!isMatch) {
        return res.status(400).json({
          error: "Current password is incorrect",
        });
      }

      const salt = await bcrypt.genSalt(10);

      currentUser.password = await bcrypt.hash(newPassword, salt);
    }

    if (profileImageFile) {
      if (currentUser.profileImageUrl) {
        const profileImageId = currentUser.profileImageUrl
          ?.split("/")
          .pop()
          ?.split(".")[0] as string;

        await destroyImageCloudinary(profileImageId);
      }
      const cloudinaryProfileImageUrl = await uploadImageToCloudinary(
        profileImageFile
      );
      currentUser.profileImageUrl = cloudinaryProfileImageUrl;
    }

    if (coverImageFile) {
      if (currentUser.coverImageUrl) {
        const coverImageId = currentUser.coverImageUrl
          ?.split("/")
          .pop()
          ?.split(".")[0] as string;
        await destroyImageCloudinary(coverImageId);
      }
      const cloudinaryCoverImageUrl = await uploadImageToCloudinary(
        coverImageFile
      );
      currentUser.coverImageUrl = cloudinaryCoverImageUrl;
    }

    currentUser.name = name;
    currentUser.email = email;
    currentUser.username = username;
    currentUser.bio = bio;

    await currentUser.save();
    return res.status(200).json(currentUser);
  } catch (error: any) {
    console.log("Error In updateUserProfile", error);
    res.status(500).json({ error: error.message });
  }
};
