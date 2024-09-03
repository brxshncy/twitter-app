import { Request, Response } from "express";
import User, { IUser } from "../models/user.model";
import mongoose from "mongoose";
import Notification from "../models/notification.model";
import bcrypt from "bcryptjs";
import {
    cloudinaryImageIdExtracter,
    destroyImageCloudinary,
    uploadImageToCloudinary,
} from "../utils/cloudinary";

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
        const me = (await User.findById(req.user._id)) as IUser;
        const usersFollowedByMe = await User.findById(me._id).select(
            "following"
        );

        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: me._id },
                },
            },
            { $sample: { size: 10 } },
        ]);

        const filteredUsers = users.filter(
            (user) => !usersFollowedByMe?.following.includes(user._id)
        );
        const suggestedUsers = filteredUsers.slice(0, 4);
        res.status(200).json(suggestedUsers);
    } catch (error) {}
};

export const followUnfollowUser = async (req: Request, res: Response) => {
    try {
        // Get me
        const me = (await User.findById(req.user._id)) as IUser;
        // Get User to follow
        const toFollowUserId = req.params.id;
        const userToFollow = (await User.findById(toFollowUserId)) as IUser;
        const ObjectId = mongoose.Types.ObjectId;

        if (!userToFollow) {
            return res.status(404).json({
                message: "User to follow not found",
            });
        }
        // Check if user followed is me.
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

        // Check if me is already following the user
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

            // Add notification
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

export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        // Extract body req
        const { name, email, username, currentPassword, newPassword, bio } =
            req.body;

        let profileImageFile;
        let coverImageFile;

        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };

        if (files) {
            profileImageFile = files["profileImageUrl"]
                ? files["profileImageUrl"][0]
                : null;
            coverImageFile = files["coverImageUrl"]
                ? files["coverImageUrl"][0]
                : null;
        }

        const me = await User.findById(req.user._id);
        if (!me) {
            return res.status(404).json({
                message: "User not found!",
            });
        }

        if (
            (!newPassword && currentPassword) ||
            (!currentPassword && newPassword)
        ) {
            return res.status(403).json({
                message: "Please provide both current and new password",
            });
        }
        // Update user password logic
        if (newPassword && currentPassword) {
            const isMatch = await bcrypt.compare(me.password, currentPassword);

            if (!isMatch) {
                return res.status(403).json({
                    message: "Current password is incorrect!",
                });
            }
            const salt = await bcrypt.genSalt(10);
            const newHashedPassword = await bcrypt.hash(newPassword, salt);
            me.password = newHashedPassword;
        }

        if (profileImageFile) {
            if (me.profileImageUrl) {
                const imgId = cloudinaryImageIdExtracter(me.profileImageUrl);
                await destroyImageCloudinary(imgId);
            }

            const cdnProfImageUrl = await uploadImageToCloudinary(
                profileImageFile as Express.Multer.File
            );
            me.profileImageUrl = cdnProfImageUrl;
        }

        if (coverImageFile) {
            if (me.coverImageUrl) {
                const imgId = cloudinaryImageIdExtracter(me.coverImageUrl);
                await destroyImageCloudinary(imgId);
            }
            const cdnCoverImageUrl = await uploadImageToCloudinary(
                coverImageFile as Express.Multer.File
            );
            me.coverImageUrl = cdnCoverImageUrl;
        }

        me.name = name;
        me.email = email;
        me.username = username;
        me.bio = bio;

        await me.save();
        return res.status(200).json(me);
    } catch (error: any) {
        console.log("Error In updateUserProfile", error);
        res.status(500).json({ error: error.message });
    }
};
