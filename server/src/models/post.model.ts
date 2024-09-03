import mongoose, { Document, Schema } from "mongoose";

export interface IPost extends Document {
    user: Schema.Types.ObjectId;
    tweet: string;
    attachmentUrl?: string | null;
    likes: Schema.Types.ObjectId[];
    comments: [
        {
            user: Schema.Types.ObjectId;
            comment: string;
        }
    ];
}

const postSchema: Schema<IPost> = new mongoose.Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        tweet: {
            type: String,
            required: true,
        },
        attachmentUrl: {
            type: String,
            default: null,
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        comments: [
            {
                comment: { type: String, required: true },
                user: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                },
            },
        ],
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
