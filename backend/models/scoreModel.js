import mongoose from "mongoose";
const { Schema, model } = mongoose;

const scoreSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

scoreSchema.index({ count: -1, updatedAt: -1 });

export default model("Score", scoreSchema);
