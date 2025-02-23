import express from "express";
import { createPodcast, deletePodcast, getAllPodcasts} from "../controllers/podcast.controllers.js";

const router = express.Router();

router.route("/").get(getAllPodcasts).post(createPodcast);
router.route("/:id").delete(deletePodcast);

export default router;
