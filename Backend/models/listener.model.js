import mongoose from "mongoose";

const listenerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    preferences: {
      type: [String], // Array of podcast preferences
      required: true,
    },
    profilePic: {
      type: String, // Optional user profile picture
      default: "",
    },
    liked: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Podcast",
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Listener", listenerSchema);
