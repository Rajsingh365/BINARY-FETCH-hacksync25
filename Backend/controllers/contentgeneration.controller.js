import fs from "fs";
import path from "path";

export const audioGeneration = async (req, res) => {
  try {
    console.log("Received POST request at /audio-generation");

    // ✅ Extract FormData (script, language)
    const { script, language } = req.body;
    console.log("Received Form Data:", { script, language });

    // ✅ Check if Files Exist
    if (!req.files || !req.files.audioFiles) {
      return res.status(400).json({ error: "No audio files uploaded." });
    }

    // ✅ Ensure "uploads" Directory Exists
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // ✅ Convert Single File to Array if Only One File Is Uploaded
    const files = Array.isArray(req.files.audioFiles)
      ? req.files.audioFiles
      : [req.files.audioFiles];

    // ✅ Rename and Move Files
    const renamedAudioFiles = files.map((file, index) => {
      const newFileName = `Speaker${index + 1}.wav`;
      const newFilePath = path.join(uploadDir, newFileName);

      // ✅ Move File to "uploads/" Directory
      file.mv(newFilePath, (err) => {
        if (err) {
          console.error("Error moving file:", err);
          return res.status(500).json({ error: "File upload failed." });
        }
      });

      return {
        label: `Speaker${index + 1}`,
        originalName: file.name,
        newFileName,
        filePath: newFilePath,
        fileType: file.mimetype,
        size: file.size,
      };
    });

    // ✅ Send Response
    res.status(200).json({
      message: "Audio files processed successfully!",
      script,
      language,
      audioFiles: renamedAudioFiles,
    });
  } catch (error) {
    console.error("Error in audio generation controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};