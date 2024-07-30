import express from "express";
import {
  commentOnPost,
  createPost,
  deletePost,
  getPostFeeds,
  toggleLikePost,
} from "../controllers/post.controller";
import { protectedRoute } from "../middleware/auth.middleware";
import { upload } from "../utils/multer";
import { postValidator } from "../validation/post.validator";

export const postRouter = express.Router();

postRouter
  .route("/")
  .post(protectedRoute, upload.single("imageUrl"), postValidator, createPost)
  .get(getPostFeeds);

postRouter.route("/comment/:id").post(protectedRoute, commentOnPost);
postRouter.route("/like/:id").post(protectedRoute, toggleLikePost);
postRouter.route("/:id").delete(protectedRoute, deletePost);
export default postRouter;
