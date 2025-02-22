import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useScriptContext } from "../context/ScriptContext";
import { Edit, ContentCopy, UploadFile } from "@mui/icons-material";

export default function GenerateAudio() {
  const { textScript, setTextScript } = useScriptContext();
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [isEditing, setIsEditing] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [editableText, setEditableText] = useState(textScript);
  const [audioFiles, setAudioFiles] = useState([]); // Maintain order of uploaded files

  useEffect(() => {
    setEditableText(textScript);
  }, [textScript]);

  // Handle file upload & preserve order
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const wavFiles = files.filter((file) => file.type === "audio/wav");

    if (wavFiles.length === 0) {
      setError("Only .wav audio files are allowed.");
      return;
    }

    setAudioFiles((prevFiles) => [...prevFiles, ...wavFiles]); // Maintain order
    setError("");
  };

  // Remove an audio file & keep order intact
  const handleRemoveFile = (index) => {
    setAudioFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Handle form submission & display FormData
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editableText.trim() || !selectedLanguage || audioFiles.length === 0) {
      setError("Please fill in all fields and upload at least one audio file.");
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append("script", editableText);
    formData.append("language", selectedLanguage);
    audioFiles.forEach((file, index) => {
      formData.append(`audioFile_${index + 1}`, file);
    });

    // Display FormData in console (instead of POST request)
    console.log("Form Data Entries:");
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/content-generation/audio-generation`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log("Audio Generated:", data);

      setError("");
    } catch (err) {
      setError("Failed to generate audio. Please try again.");
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
        {/* Script Field */}
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

        {/* Language Selection */}
        <div>
          <label className="block text-black mb-2 font-medium">Language</label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Language</option>
            <option value="hindi">Hindi</option>
            <option value="english">English</option>
          </select>
        </div>

        {/* Audio File Upload */}
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

        {/* Action Buttons */}
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
    </div>
  );
}
