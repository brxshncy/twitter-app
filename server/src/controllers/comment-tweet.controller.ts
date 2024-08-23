import { Request, Response } from "express";
import Post from "../models/post.model";

export const commentOnTweet = async (req: Request, res: Response) => {
    try {
        const { comment } = req.body;
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: "Tweet not found" });

        const newComment = { user: req.user.id, comment };
        post?.comments.push(newComment);
        await post?.save();
        res.status(200).json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong!",
        });
    }
};
