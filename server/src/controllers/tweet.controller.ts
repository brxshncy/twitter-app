import { Request, Response } from "express";
import {
    cloudinaryImageIdExtracter,
    destroyImageCloudinary,
    uploadImageToCloudinary,
} from "../utils/cloudinary";
import User, { IUser } from "../models/user.model";
import Post from "../models/post.model";

export const getTweets = async (req: Request, res: Response) => {
    const me = await User.findById(req.user._id).populate("following").exec();
    if (!me) {
        return res.status(404).json({
            message: "User not found",
        });
    }
    // Convert following ids from objectId to String
    const followedUserIds: string[] = me?.following.map((user) =>
        user.id.toString()
    );
    followedUserIds.push(me._id.toString());
    const tweets = await Post.find({
        user: { $in: followedUserIds },
    });
    res.status(200).json(tweets);
};

export const postTweet = async (req: Request, res: Response) => {
    try {
        const { tweet } = req.body;

        if (!tweet) {
            res.status(403).json({
                message: "Tweet cannot be empty",
            });
        }
        let attachmentUrl;

        if (req.file) {
            attachmentUrl = await uploadImageToCloudinary(
                req.file as Express.Multer.File
            );
        }

        const me = await User.findById(req.user._id);

        if (!me) return res.status(404).json({ message: "User not found" });

        const newTweet = new Post({
            tweet,
            user: me._id,
            attachmentUrl,
            likes: [],
            comments: [],
        });

        if (newTweet) {
            await newTweet.save();
            res.status(203).json(newTweet);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong!",
        });
    }
};

export const updateTweet = async (req: Request, res: Response) => {
    try {
        const me = await User.findById(req.user._id);
        const tweet = await Post.findById(req.params.id);
        let attachmentUrl;
        if (!me || !tweet) {
            return res.status(404).json({
                message: "Tweet not found ",
            });
        }

        const isTweetMine = tweet.user.toString() === me._id.toString();
        if (!isTweetMine) {
            return res.status(403).json({
                message: "You cannot update other's tweet",
            });
        }

        const { tweet: updatedTweet } = req.body;
        tweet.tweet = updatedTweet;

        if (req.file) {
            if (tweet.attachmentUrl) {
                const imgId = cloudinaryImageIdExtracter(tweet.attachmentUrl);
                console.log("image destroyed");
                await destroyImageCloudinary(imgId);
            }
            tweet.attachmentUrl = await uploadImageToCloudinary(
                req.file as Express.Multer.File
            );
        }

        await tweet.save();
        return res.json(tweet);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong!",
        });
    }
};

export const deleteTweet = async (req: Request, res: Response) => {
    try {
        const tweet = await Post.findById(req.params.id);

        if (!tweet) return res.status(404).json({ message: "Tweet deleted" });

        if (!tweet.user.toString() === req.user.id)
            return res
                .status(401)
                .json({ message: "Unauthorize to the such action" });
        if (tweet.attachmentUrl) {
            const imgId = cloudinaryImageIdExtracter(tweet.attachmentUrl);
            console.log("Image destroyed");
            await destroyImageCloudinary(imgId);
        }

        await tweet.deleteOne();
        return res.status(200).json({ message: "Tweet removed" });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong!",
        });
    }
};
