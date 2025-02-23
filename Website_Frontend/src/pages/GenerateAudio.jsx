import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useScriptContext } from "../context/ScriptContext";
import { Edit, ContentCopy, UploadFile } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AudioLoader from "../components/AudioLoader";
import toast from "react-hot-toast";
import Piyush from "../assets/piyush.wav";

export default function GenerateAudio() {
  const { textScript, setTextScript, setAudioFile, audioFile } =
    useScriptContext();
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [isEditing, setIsEditing] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [editableText, setEditableText] = useState(textScript);
  const [audioFiles, setAudioFiles] = useState([]);
  const [outputUrl, setOutputUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setAudioFile(Piyush);
    setEditableText(textScript);
  }, [textScript]);
  async function convertAudioToFile() {
    try {
      const response = await fetch(Piyush); // Fetch the audio file as a blob
      const blob = await response.blob();

      const audio = new File([blob], "piyush.wav", { type: "audio/wav" });

      console.log("Converted File:", audio); // Debugging log
      setAudioFile(audio);
    } catch (error) {
      console.error("Error converting audio file:", error);
    }
  }

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const wavFiles = files.filter((file) => file.type === "audio/wav");

    if (wavFiles.length === 0) {
      setError("Only .wav audio files are allowed.");
      return;
    }

    setAudioFiles((prevFiles) => [...prevFiles, ...wavFiles]);
    setError("");
  };

  const handleRemoveFile = (index) => {
    setAudioFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) {
      toast("Please wait for the current audio to be generated.");
      return;
    }
    setOutputUrl(null);
    setError("");

    if (!editableText.trim() || !selectedLanguage || audioFiles.length === 0) {
      setError("Please fill in all fields and upload at least one audio file.");
      return;
    }

    const formData = new FormData();
    formData.append("script", editableText);
    formData.append("language", selectedLanguage);
    audioFiles.forEach((file, index) => {
      formData.append(`audioFile_${index + 1}`, file);
    });

    try {
      setLoading(true);
      const { data } = await axios({
        method: "post",
        url: `${import.meta.env.VITE_BACKEND_URL}/api/content-generation/audio-generation`,
        data: formData,
        headers: {
          "Content-Type": `multipart/form-data`,
        },
      });

      setOutputUrl(`${import.meta.env.VITE_BACKEND_URL}${data.audioUrl}`);
      setAudioFile(`${import.meta.env.VITE_BACKEND_URL}${data.audioUrl}`)
      convertAudioToFile();
      setError("");
    } catch (err) {
      setError("Failed to generate audio. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editableText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto bg-white text-black rounded-lg shadow-lg">
      <motion.form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-black mb-2 font-medium">Script</label>
          {isEditing ? (
            <textarea
              rows="4"
              value={editableText}
              onChange={(e) => setEditableText(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your script here..."
            />
          ) : (
            <p className="p-3 bg-gray-100 border border-gray-300 rounded-lg">
              {editableText}
            </p>
          )}
        </div>

        <div>
          <label className="block text-black mb-2 font-medium">Language</label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Language</option>
            <option value="hi">Hindi</option>
            <option value="en">English</option>
          </select>
        </div>

        <div>
          <label className="block text-black mb-2 font-medium">
            Upload .wav Files
          </label>
          <input
            type="file"
            accept=".wav"
            multiple
            onChange={handleFileUpload}
            className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
          />
          {audioFiles.length > 0 && (
            <ul className="mt-3 space-y-2">
              {audioFiles.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-700">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Save Script
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <Edit fontSize="small" /> Edit Script
              </button>
            )}
            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <ContentCopy fontSize="small" />
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generate Audio
          </button>
        </div>
      </motion.form>

      {loading && <AudioLoader />}
      {outputUrl && (
        <div className="mt-4">
          <p className="text-black font-medium">Generated Audio:</p>
          <audio controls className="w-full mt-2">
            <source src={outputUrl} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
          {/* Upload Podcast Button */}
          <button
            className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg transition"
            onClick={() => navigate("/upload-podcast")}
          >
            Upload Podcast
          </button>
        </div>
      )}
    </div>
  );
}
