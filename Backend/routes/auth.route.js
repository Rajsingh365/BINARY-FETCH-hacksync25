import express from "express";
import { loginUser, logoutUser, signUp, getAllUsers,getParticularUser } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/get-all-users/:user_id", getAllUsers)
router.get("/get-particular-user/:user_id", getParticularUser)
export default router;