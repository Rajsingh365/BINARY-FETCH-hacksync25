import express from "express";
import {
  createPodcast,
  deletePodcast,
  getAllPodcasts,
  getPodcastsByCreator,
} from "../controllers/podcast.controllers.js";

const router = express.Router();

router.route("/").get(getAllPodcasts).post(createPodcast);
router.route("/:id").delete(deletePodcast);
router.get("/creator/:id", getPodcastsByCreator);

export default router;
