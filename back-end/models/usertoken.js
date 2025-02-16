import mongoose, { Schema } from "mongoose";

const TokenSchema = new Schema(
    {
        userId: { // <-- Changed from UserId to userId
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        token: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 300
        }
    }
);

export default mongoose.model("token", TokenSchema);
