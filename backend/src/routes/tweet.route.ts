import express from "express";
import { createTweet, getAllTweets } from "../controllers/tweet.controller";

const tweetRoute = express.Router();

tweetRoute.route("/").get(getAllTweets).post(createTweet);

export default tweetRoute;
