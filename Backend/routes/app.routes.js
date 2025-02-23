import express from "express";
import { getPodcasts } from "../controllers/app.controllers.js";

const router = express.Router();

router.get("/podcasts", getPodcasts);

export default router;
