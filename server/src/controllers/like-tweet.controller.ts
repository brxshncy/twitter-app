import { Request, Response } from "express";
import Post from "../models/post.model";
import Notification from "../models/notification.model";

export const likeOnTweet = async (req: Request, res: Response) => {
    try {
        const tweet = await Post.findById(req.params.postId);

        if (!tweet) return res.status(404).json({ message: "Tweet not found" });
        if (tweet.likes.includes(req.user.id)) {
            await Post.updateOne(
                { _id: req.params.postId },
                {
                    $pull: { likes: req.user.id },
                }
            );
            return res.status(200).json({ message: "Tweet unliked" });
        } else {
            tweet.likes.push(req.user.id);
            await tweet.save();
            const meLikingMyTweet =
                req.user.id.toString() === tweet.user.toString();

            if (!meLikingMyTweet) {
                const newNotifcation = new Notification({
                    from: req.user.id,
                    to: tweet.user,
                    type: "Like",
                });
                await newNotifcation.save();
            }
            res.status(200).json({ message: "Tweet liked", tweet });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong!",
        });
    }
};
