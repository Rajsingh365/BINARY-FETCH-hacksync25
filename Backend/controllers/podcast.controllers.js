import Podcast from "../models/podcast.model.js";
import { StatusCodes } from "http-status-codes";
import { v2 as cloudinary } from "cloudinary";

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
  const { title, script, thumbnail, tags, status, scheduleTime } = req.body;
  try {
    const result = await cloudinary.uploader.upload(req.files.audio.tempFilePath, {
      use_filename: true,
      folder: "podcasts",
      resource_type: "auto", // or "raw"
    });

    const podcast = await Podcast.create({
      title,
      script,
      thumbnail,
      tags,
      status: status || "uploaded",
      creator: req.user.userId,
      audioUrl: result.secure_url,
      scheduleTime,
    });

    return res.json({ podcast });
  } catch (err) {
    console.log({ msg: "upload err :(", err });
  }
  res.send("Error");
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
