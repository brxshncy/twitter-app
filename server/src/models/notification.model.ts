import { Document, Schema, model } from "mongoose";

interface INotification extends Document {
    from: Schema.Types.ObjectId;
    to: Schema.Types.ObjectId;
    type: "follow" | "like";
    createdAt?: Date;
    updatedAt?: Date;
    read: boolean;
}

const notificationSchema: Schema<INotification> = new Schema(
    {
        from: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        to: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: ["follow", "like"],
        },
        read: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Notification = model("Notification", notificationSchema);

export default Notification;
