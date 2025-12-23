import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
    displayName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        default: 0,
        required: true
    },
    scoreUpdatedAt: {
        type: Date,
        default: Date.now
    }
})

// Index for efficient scoreboard queries
userSchema.index({ score: -1, scoreUpdatedAt: -1 });

export default model("User", userSchema);