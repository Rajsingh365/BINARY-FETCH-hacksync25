import Podcast from "../models/podcast.model.js";

export const getPodcasts = async (req, res) => {
  const podcasts = await Podcast.find({}).populate("creator", "name email").limit(10);
  res.send({ count: podcasts.length, podcasts });
};
