import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useScriptContext } from "../context/ScriptContext";
import { Link } from "react-router-dom";
import { Edit, ContentCopy, AudioFile } from "@mui/icons-material";

export default function GenerateContent() {
  const [formData, setFormData] = useState({ title: "", description: "", instruction: "" });
  const [apiResponse, setApiResponse] = useState("");
  const { textScript, setTextScript } = useScriptContext();
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({ title: "", description: "", instruction: "" });

  const validateFields = () => {
    let newErrors = { title: "", description: "", instruction: "" };
    let isValid = true;

    if (!formData.title.trim()) {
      newErrors.title = "Title is required.";
      isValid = false;
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
      isValid = false;
    }
    if (!formData.instruction.trim()) {
      newErrors.instruction = "Instruction is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) return;

    const combinedContent = `Title: ${formData.title}\n\nDescription: ${formData.description}\n\nInstruction: ${formData.instruction}`;
    setTextScript(combinedContent);
  };

  // Update `apiResponse` when `textScript` changes
  useEffect(() => {
    if (textScript) {
      setApiResponse(textScript);
    }
  }, [textScript]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear the error message when user starts typing
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto bg-white text-black rounded-lg shadow-lg">
      <h1>Generate Script For Podcast</h1>
      <motion.form onSubmit={handleSubmit} className="space-y-6" {...fadeInUp}>
        <div>
          <input
            type="text"
            name="title"
            placeholder="Enter title"
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full p-3 bg-white border ${errors.title ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <textarea
            name="description"
            placeholder="Enter description"
            rows="3"
            value={formData.description}
            onChange={handleInputChange}
            className={`w-full p-3 bg-white border ${errors.description ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div>
          <textarea
            name="instruction"
            placeholder="Enter instruction"
            rows="3"
            value={formData.instruction}
            onChange={handleInputChange}
            className={`w-full p-3 bg-white border ${errors.instruction ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.instruction && <p className="text-red-500 text-sm mt-1">{errors.instruction}</p>}
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <button
            type="submit"
            disabled={!formData.title.trim() || !formData.description.trim() || !formData.instruction.trim()}
            className={`w-full font-semibold py-3 rounded-lg transition-all ${
              !formData.title.trim() || !formData.description.trim() || !formData.instruction.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }`}
          >
            Generate Content
          </button>
        </motion.div>
      </motion.form>

      {apiResponse && (
        <GeneratedScript
          text={apiResponse}
          setTextScript={setTextScript}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      )}
    </div>
  );
}

const GeneratedScript = ({ text, setTextScript, isEditing, setIsEditing }) => {
  const [copied, setCopied] = useState(false);
  const [editableText, setEditableText] = useState(text);

  useEffect(() => {
    setEditableText(text);
  }, [text]);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editableText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    setTextScript(editableText);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={fadeInUp.initial}
      animate={fadeInUp.animate}
      transition={{ ...fadeInUp.transition, delay: 0.2 }}
      className="bg-white text-black rounded-lg shadow-lg p-6"
    >
      <h3 className="text-xl font-semibold mb-4">Generated Content</h3>

      {isEditing ? (
        <textarea
          value={editableText}
          onChange={(e) => setEditableText(e.target.value)}
          rows="6"
          className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <p className="text-gray-700 whitespace-pre-wrap">{editableText}</p>
      )}

      <div className="flex justify-end gap-2 mt-4">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all flex items-center gap-1"
          >
            <Edit /> Edit
          </button>
        )}

        <button
          onClick={handleCopy}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all flex items-center gap-1"
        >
          {copied ? "Copied!" : <ContentCopy />}
        </button>

        <Link
          to="/generate-audio"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-1"
        >
          <AudioFile /> Generate Audio
        </Link>
      </div>
    </motion.div>
  );
};
