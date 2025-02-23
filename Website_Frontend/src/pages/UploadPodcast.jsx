import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CloudUpload, Schedule } from "@mui/icons-material";
import toast from "react-hot-toast";
import axios from "axios";
import { useScriptContext } from "../context/ScriptContext";
import { useAuthContext } from "../context/AuthContext";
import moment from "moment-timezone";

export function UploadPodcast() {
  const { textScript, tags, title, setTextScript, setTags, setTitle } =
    useScriptContext();
  const { authToken } = useAuthContext();

  const [formData, setFormData] = useState({
    title: title || "",
    script: textScript || "",
    tags: tags || "",
    image: null,
    audioFile: null,
    status: "uploaded", // Default status
    scheduleTime: "",
  });

  const [uploading, setUploading] = useState(false);
  const [scheduling, setScheduling] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null);

  // Update state when context values change
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      script: textScript || "",
      title: title || "",
      tags: tags || "",
    }));
  }, [textScript, title, tags]);

  // Generate audio preview URL
  useEffect(() => {
    if (formData.audioFile instanceof File) {
      const objectUrl = URL.createObjectURL(formData.audioFile);
      setAudioUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl); // Cleanup URL on unmount
    }
  }, [formData.audioFile]);

  // Handle File Uploads (Image & Audio)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const { name } = e.target;
    setFormData((prev) => ({ ...prev, [name]: file }));

    // Debugging log
    console.log(`File Uploaded: ${name} - ${file.name}`);

    if (name === "audioFile") {
      const objectUrl = URL.createObjectURL(file);
      setAudioUrl(objectUrl);
    }
  };

  // Handle Text Inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (isScheduled) => {
    if (!formData.title || !formData.script || !formData.audioFile) {
      toast.error("Please fill in all required fields!");
      return;
    }
  
    if(!isScheduled)
      setUploading(true);
    else 
      setScheduling(true)
    const podcastData = new FormData();
    podcastData.append("title", formData.title);
    podcastData.append("script", formData.script);
    podcastData.append("tags", JSON.stringify(formData.tags.split(","))); 
    podcastData.append("audio", formData.audioFile); 
  
    if (formData.image) {
      podcastData.append("thumbnail", formData.image);
    }
  
    // ✅ Format Schedule Time (Use selected time or current time)
    const selectedDateTime = formData.scheduleTime
      ? moment.tz(formData.scheduleTime, "Asia/Kolkata").format("YYYY-MM-DDTHH:mm:ss.SSSZ")
      : moment().tz("Asia/Kolkata").format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  
    podcastData.append("scheduleTime", selectedDateTime);
  
    try {
      podcastData.forEach((value, key) => {
        console.log(key, value);
      });
  
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/podcast`,
        podcastData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
  
      toast.success(isScheduled ? "Podcast Scheduled!" : "Podcast Uploaded!");
      console.log("Response:", response.data);
  
      setFormData({
        title: "",
        script: "",
        tags: "",
        image: null,
        audioFile: null,
        scheduleTime: "",
      });
  
      setAudioUrl(null);
      setTags("");
      setTextScript("");
      setTitle("");
    } catch (error) {
      console.error("Error uploading podcast:", error);
      toast.error("Error uploading podcast!");
    } finally {
      if(!isScheduled)
        setUploading(false);
      else 
        setScheduling(false)
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        className="w-full max-w-lg bg-white text-black p-8 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          Upload Your Podcast
        </h2>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-medium">
              Podcast Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 font-medium">
              Cover Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer"
            />
          </div>

          {/* Script */}
          <div>
            <label className="block text-gray-700 font-medium">
              Podcast Script
            </label>
            <textarea
              name="script"
              value={formData.script}
              onChange={handleChange}
              placeholder="Enter script"
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Audio File Display or Upload */}
          <div>
            <label className="block text-gray-700 font-medium">
              Podcast Audio File
            </label>
            {audioUrl ? (
              <div className="p-3 bg-gray-100 border border-gray-300 rounded-lg flex flex-col items-center">
                <audio controls className="w-full">
                  <source src={audioUrl} type="audio/wav" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            ) : (
              <input
                type="file"
                name="audioFile"
                accept="audio/*"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer"
              />
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-gray-700 font-medium">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g. tech, business, AI"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Schedule Time (Optional) */}
          <div>
            <label className="block text-gray-700 font-medium">
              Schedule Time (Optional)
            </label>
            <input
              type="datetime-local"
              name="scheduleTime"
              value={formData.scheduleTime}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700 transition"
              disabled={uploading}
            >
              <CloudUpload />
              {uploading ? "Uploading..." : "Upload"}
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(true)}
              className="px-6 py-2 bg-yellow-600 text-white rounded-lg flex items-center gap-2 hover:bg-yellow-700 transition"
              disabled={scheduling}
            >
              <Schedule />
              {scheduling ? "Scheduling..." : "Schedule"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
