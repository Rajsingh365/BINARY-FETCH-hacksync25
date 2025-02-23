import express from "express";
import { getListener, likePodcast, login, signup } from "../controllers/listener.controllers.js";
import { protectRoute } from "../middleware/authentication.js";
const router = express.Router();

router.get("/", protectRoute, getListener);
router.post("/login", login);
router.post("/signup", signup);
router.post("/like/:id", protectRoute, likePodcast);

export default router;
