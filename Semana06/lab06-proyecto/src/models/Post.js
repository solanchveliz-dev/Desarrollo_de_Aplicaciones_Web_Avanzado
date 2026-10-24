import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 5,
        maxlength: 30,
        required: true
    },
    content: {
        type: String,
        minlength: 10,
        required: true
    },
    hashtags: [String],
    imageUrl: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

export default mongoose.model("Post", postSchema);
