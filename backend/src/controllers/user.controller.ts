import { Request, Response } from "express";
import User from "../models/user.model";
import mongoose, { ObjectId } from "mongoose";
import { Notification } from "../models/notification.model";

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
    const { id } = req.params;

    const userToFollow = await User.findById(id);
    const currentUser = await User.findById(req.user._id);
    const ObjectId = mongoose.Types.ObjectId;
    if (new ObjectId(id).equals(req.user._id)) {
      return res.status(400).json({
        error: "You can't follow/unfollow yourself",
      });
    }

    if (!userToFollow || !currentUser)
      return res.status(404).json({
        error: "User not found",
      });

    const isFollowing = currentUser.following.includes(new ObjectId(id));

    if (isFollowing) {
      await User.findByIdAndUpdate(id, {
        $pull: { followers: req.user._id },
      });

      await User.findByIdAndUpdate(req.user._id, {
        $pull: { following: id },
      });

      res.status(200).json({
        message: "User unfollowed successfully!",
      });
    } else {
      await User.findByIdAndUpdate(id, {
        $push: { followers: req.user._id },
      });
      await User.findByIdAndUpdate(req.user._id, {
        $push: { following: id },
      });

      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: userToFollow._id,
      });

      await newNotification.save();
      res.status(200).json({
        message: "User followed successfully!",
      });
    }
  } catch (error: any) {
    console.log("Error In toggleFollowUser", error);
    res.status(500).json({
      error: error.message,
    });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {};
