import mongoose from "mongoose";

const podcastSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator reference is required"],
    },
    title: {
      type: String,
      required: [true, "Podcast title is required"],
    },
    script: {
      type: String,
      required: [true, "Script is required"],
    },
    audioUrl: {
      type: String,
      required: [true, "Audio url is required"],
    },
    tags: {
      type: [String],
      default: [],
    },
    thumbnail: {
      type: String,
      required: [true, "Thumbnail is required"],
    },
    status: {
      type: String,
      enum: ["scheduled", "uploaded"],
      default: ["uploaded"],
    },
    scheduleTime: {
      type: Date,
    },
    views: {
      type: Number,
      default: 0,
      min: [0, "View count must be non-negative"],
    },
    likes: {
      type: Number,
      default: 0,
      min: [0, "Like count must be non-negative"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Podcast", podcastSchema);
