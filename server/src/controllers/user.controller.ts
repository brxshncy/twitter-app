import { Request, Response } from "express";
import User, { IUser } from "../models/user.model";
import mongoose from "mongoose";
import Notification from "../models/notification.model";

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
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

export const getSuggestedUser = async (req: Request, res: Response) => {
    try {
    } catch (error) {}
};

export const followUnfollowUser = async (req: Request, res: Response) => {
    try {
        const me = (await User.findById(req.user._id)) as IUser;
        const toFollowUserId = req.params.id;
        const userToFollow = (await User.findById(toFollowUserId)) as IUser;
        const ObjectId = mongoose.Types.ObjectId;

        if (!userToFollow) {
            return res.status(404).json({
                message: "User to follow not found",
            });
        }

        if (new ObjectId(toFollowUserId).equals(me._id)) {
            return res.status(403).json({
                message: "You cannot follow/unfollow yourself",
            });
        }

        if (!me || !userToFollow) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const isFollowing = me.following.includes(userToFollow._id);

        if (isFollowing) {
            // Remove the current user to the followed USER followers
            await User.findByIdAndUpdate(userToFollow._id, {
                $pull: { followers: me._id },
            });

            // Remove current user followings to followed User
            await User.findByIdAndUpdate(me._id, {
                $pull: { following: userToFollow._id },
            });

            res.status(200).json({
                message: "User unfollowed",
            });
        } else {
            // Add the current user to the followed User followers
            await User.findByIdAndUpdate(userToFollow._id, {
                $push: { followers: me._id },
            });
            // Add the current user following to the User followed
            await User.findByIdAndUpdate(me._id, {
                $push: { following: userToFollow._id },
            });

            const newNotifcation = new Notification({
                type: "follow",
                from: me._id,
                to: userToFollow._id,
            });

            await newNotifcation.save();

            res.status(200).json({
                message: "User followed",
            });
        }
    } catch (error) {}
};
