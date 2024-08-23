import express from "express";
import {
    deleteTweet,
    getTweets,
    postTweet,
    updateTweet,
} from "../controllers/tweet.controller";
import { protectedRoutes } from "../ middlewares/auth.middleware";
import { upload } from "../utils/multer";
import { tweetValidator } from "../validators/tweet.validator";
import { commentOnTweet } from "../controllers/comment-tweet.controller";
import { likeOnTweet } from "../controllers/like-tweet.controller";

const tweetRoute = express.Router();

tweetRoute
    .route("/")
    .post(
        protectedRoutes,
        upload.single("fileAttachment"),
        tweetValidator,
        postTweet
    )
    .get(protectedRoutes, getTweets);

tweetRoute
    .route("/:id")
    .put(
        protectedRoutes,
        upload.single("fileAttachment"),
        tweetValidator,
        updateTweet
    )
    .delete(protectedRoutes, deleteTweet);

tweetRoute.route("/comment/:postId").post(protectedRoutes, commentOnTweet);
tweetRoute.route("/like/:postId").post(protectedRoutes, likeOnTweet);
export default tweetRoute;
