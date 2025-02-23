import express from "express";
import { loginUser, logoutUser, signUp, getAllUsers } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/get-all-users", getAllUsers)

export default router;