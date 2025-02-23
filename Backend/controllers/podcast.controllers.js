import Podcast from "../models/podcast.model.js";
import { StatusCodes } from "http-status-codes";
import { v2 as cloudinary } from "cloudinary";
import { agenda } from "../agenda.js";

export const getAllPodcasts = async (req, res) => {
  try {
    const podcasts = await Podcast.find({ creator: req.user.userId })  
      .sort("-createdAt")
      .populate("creator", "name email");

    res.status(StatusCodes.OK).json({
      count: podcasts.length,
      podcasts,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Error fetching podcasts",
      error: error.message,
    });
  }
};

export const createPodcast = async (req, res) => {
  try {
    const { title, script, tags, scheduleTime } = req.body;
    const postTime = new Date(scheduleTime);

    if (!req.files || !req.files.audio) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    console.log("Received Files:", req.files);

    const audioResult = await cloudinary.uploader.upload(req.files.audio.tempFilePath, {
      use_filename: true,
      folder: "podcasts",
      resource_type: "auto",
    });

    let thumbnailUrl = ""; 
    console.log("thumbnail", req.files);

    if (req.files.thumbnail) {
      const thumbnailResult = await cloudinary.uploader.upload(req.files.thumbnail.tempFilePath, {
        use_filename: true,
        folder: "podcast_thumbnails",
        resource_type: "image",
      });

      thumbnailUrl = thumbnailResult.secure_url;
    }

    // ✅ Store Podcast Data in Database
    const podcast = await Podcast.create({
      title,
      script,
      thumbnail: thumbnailUrl, // Store the uploaded image URL
      tags: JSON.parse(tags), // Convert tags from JSON string to array
      creator: req.user.userId, // Assuming user is authenticated
      audioUrl: audioResult.secure_url, // Store uploaded audio URL
      scheduleTime,
    });

    agenda.schedule(postTime, "Post", { podcastId: podcast._id });
    return res.json({ podcast });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: "Podcast upload failed" });
  }
};


export const deletePodcast = async (req, res) => {
  try {
    const { id: podcastId } = req.params;

    // Find podcast and ensure it exists
    const podcast = await Podcast.findOne({
      _id: podcastId,
      creator: req.user.userId,
    });

    if (!podcast) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: `No podcast found with id ${podcastId}`,
      });
    }

    await Podcast.findByIdAndDelete(podcastId);

    res.status(StatusCodes.OK).json({
      msg: "Podcast successfully deleted",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Error deleting podcast",
      error: error.message,
    });
  }
};

export const getPodcastsByCreator = async (req, res) => {
  const userId = req.params.id;
  const podcasts = await Podcast.find({ creator: userId });

  res.json({ count: podcasts.length, podcasts });
};
