import { Request, Response } from "express";
import {
  cloudinaryImageIdExtracter,
  destroyImageCloudinary,
  uploadImageToCloudinary,
} from "../utils/cloudinary";
import Post from "../models/post.model";
import User from "../models/user.model";

export const getPostFeeds = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find({});
  } catch (error) {}
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    let img = null;

    if (req.file) {
      img = await uploadImageToCloudinary(req.file as Express.Multer.File);
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        error: "User not found!",
      });
    }

    const newPost = new Post({
      text,
      user: req.user._id,
      img,
      likes: [],
      comments: [],
    });

    if (newPost) {
      await newPost.save();
      res.status(203).json(newPost);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        error: "Post not found!",
      });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        error: "You are not authorized to remove this post",
      });
    }

    if (post.img) {
      const imgId = cloudinaryImageIdExtracter(post.img);
      console.log("image destroyed");
      await destroyImageCloudinary(imgId);
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Post deleted successfully!",
    });
  } catch (error) {}
};
