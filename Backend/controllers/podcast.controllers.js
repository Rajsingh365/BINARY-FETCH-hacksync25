import Podcast from "../models/podcast.model";
import { StatusCodes } from "http-status-codes";

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
    // Add creator to request body
    req.body.creator = req.user.userId;

    // Validate required fields
    const { title, script, audioUrl, thumbnail } = req.body;
    if (!title || !script || !audioUrl || !thumbnail) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Please provide all required fields",
      });
    }

    const podcast = await Podcast.create(req.body);

    res.status(StatusCodes.CREATED).json({
      msg: "Podcast created successfully",
      podcast,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Error creating podcast",
      error: error.message,
    });
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
