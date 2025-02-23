import express from "express";
import { audioGeneration } from "../controllers/contentgeneration.controller.js";
import fileUpload from "express-fileupload";

const router = express.Router();
router.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

router.post("/audio-generation", audioGeneration);

export default router;
