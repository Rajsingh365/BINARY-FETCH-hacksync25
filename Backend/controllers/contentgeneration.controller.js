import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data"; // Import FormData for Node.js
import "dotenv/config";

export const audioGeneration = async (req, res) => {
  try {
    console.log("Received POST request at /audio-generation");

    // ✅ Extract FormData (script, language)
    const { script, language } = req.body;
    console.log("Received Form Data:", { script, language });

    console.log("Received Files:", req.files);

    // ✅ Ensure Files Exist
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: "No files uploaded." });
    }

    // ✅ Ensure "uploads" Directory Exists
    const __dirname = path.resolve();
    const uploadDir = path.join(__dirname, "./uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // ✅ Process Uploaded Files Dynamically
    const uploadedFiles = Object.values(req.files); // Convert object to array

    const renamedAudioFiles = await Promise.all(
      uploadedFiles.map((file, index) => {
        return new Promise((resolve, reject) => {
          const newFileName = `Speaker${index + 1}.wav`;
          const newFilePath = path.join(uploadDir, newFileName);

          file.mv(newFilePath, (err) => {
            if (err) {
              console.error("Error moving file:", err);
              reject(new Error("File upload failed."));
            } else {
              resolve({
                label: `Speaker${index + 1}`,
                originalName: file.name,
                newFileName,
                filePath: newFilePath,
                fileType: file.mimetype,  
                size: file.size,
              });
            }
          });
        });
      })
    );

    // ✅ Create FormData for TTS Request
    const formData = new FormData();  
    formData.append("script", script);  
    formData.append("language", language);
  
    // ✅ Append all files to FormData
    renamedAudioFiles.forEach((file) => {
      formData.append(file.newFileName, fs.createReadStream(file.filePath));
    });

    // ✅ Send Request to TTS_URL
    const { data } = await axios.post(`${process.env.TTS_URL}/generate_podcast`, formData, {
      headers: {
        ...formData.getHeaders(), // Set correct Content-Type with boundary
      },
      responseType: "arraybuffer", 
    });  

    console.log("TTS Response:", data);

    const outputDir = path.join(__dirname, "./output/audio");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // ✅ Save the TTS audio response
    const outputFilePath = path.join(outputDir, "tts_response.mp3");
    fs.writeFileSync(outputFilePath, data);

    console.log("TTS Response Audio saved at:", outputFilePath);

    // res.sendFile(outputFilePath);
    res.json({audioUrl: '/audio/tts_response.mp3'})

    // ✅ Send Response
    // res.status(200).json({
    //   message: "Audio files processed and sent to TTS successfully!",
    //   // ttsResponse: data, // Return TTS API response
    // });

  } catch (error) {
    console.error("Error in audio generation controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
