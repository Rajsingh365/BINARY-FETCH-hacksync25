import { useState } from "react";
import {Link} from 'react-router-dom'
import { useScriptContext } from "../context/ScriptContext";
import { Edit, ContentCopy, AudioFile } from "@mui/icons-material"

export default function GenerateContent() {
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    instructions: "",
  });

  const [apiResponse, setApiResponse] = useState(null); // Store the API response
  const [editableScript, setEditableScript] = useState(""); // Store editable script
  const [editableTags, setEditableTags] = useState(""); // Store editable tags
  const [copiedScript, setCopiedScript] = useState(false); // Track if script is copied
  const [copiedTags, setCopiedTags] = useState(false); // Track if tags are copied

  const {setTextScript, setTags } = useScriptContext()

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Log the collected inputs
    console.log("Collected Inputs:", formData);

    // Create FormData object
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("summary", formData.summary);
    formDataToSend.append("instructions", formData.instructions);

    // Log FormData content (for debugging)
    for (let [key, value] of formDataToSend.entries()) {
      console.log(key, value);
    }

    // Send FormData to the backend
    try {
      const response = await fetch(`${import.meta.env.VITE_FLASK_URL}/generate/script`, {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Backend Response:", result);

      // Set the API response
      setApiResponse(result);
      let scriptsRes=JSON.stringify(result.content, null, 2)
      let tags = result.tags.join(", ")

      setTags(tags)
      setTextScript(scriptsRes)

      // Set editable fields with the initial response
      setEditableScript(scriptsRes); // Pretty-print JSON
      setEditableTags(); // Convert tags array to a string
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(editableScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000); // Reset copied state after 2 seconds
  };

  const handleCopyTags = () => {
    navigator.clipboard.writeText(editableTags);
    setCopiedTags(true);
    setTimeout(() => setCopiedTags(false), 2000); // Reset copied state after 2 seconds
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto bg-white text-black rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold">Generate Script For Podcast</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            name="title"
            placeholder="Enter title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <textarea
            name="summary"
            placeholder="Enter summary"
            rows="3"
            value={formData.summary}
            onChange={handleInputChange}
            className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <textarea
            name="instructions"
            placeholder="Enter instructions"
            rows="3"
            value={formData.instructions}
            onChange={handleInputChange}
            className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full font-semibold py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-all"
        >
          Generate Content
        </button>
      </form>

      {apiResponse && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Generated Script</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <textarea
              value={editableScript}
              onChange={(e) => setEditableScript(e.target.value)}
              rows="10"
              className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleCopyScript}
              className="mt-2 bg-slate-400 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-all"
            >
              {copiedScript ? "Copied!" : "Copy Script"}
            </button>
          </div>

          <h2 className="text-xl font-semibold mt-6 mb-4">Generated Tags</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <input
              type="text"
              value={editableTags}
              onChange={(e) => setEditableTags(e.target.value)}
              className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleCopyTags}
              className="mt-2 bg-slate-400 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-all"
            >
              {copiedTags ? "Copied!" : "Copy Tags"}
            </button>
          </div>

          <Link
            to="/generate-audio"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-1"
          >
            <AudioFile /> Generate Audio
          </Link>
        </div>
      )}
    </div>
  );
}