import { Link, useLocation } from "react-router-dom";
import { Home, AddCircleOutline, Headphones } from "@mui/icons-material";
import { motion } from "framer-motion";

const sidebarVariants = {
  hidden: { x: -250, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.5 } },
};

export default function Sidebar() {
  const location = useLocation(); // Get current route path

  return (
    <motion.div
      className="h-screen w-64 bg-white text-black fixed top-20 left-0 shadow-xl p-4"
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
    >
      <ul className="space-y-2">
        {/* Home */}
        <li>
          <Link
            to="/"
            className={`flex items-center gap-3 p-3 rounded transition-all duration-300 ${
              location.pathname === "/" ? "bg-gray-200 text-orange-500" : "hover:bg-gray-100"
            }`}
          >
            <Home className={`${location.pathname === "/" ? "text-orange-500" : ""}`} />
            <span>Home</span>
          </Link>
        </li>

        {/* Create Content */}
        <li>
          <Link
            to="/generate-content"
            className={`flex items-center gap-3 p-3 rounded transition-all duration-300 ${
              location.pathname === "/generate-content" ? "bg-gray-200 text-orange-500" : "hover:bg-gray-100"
            }`}
          >
            <AddCircleOutline className={`${location.pathname === "/generate-content" ? "text-orange-500" : ""}`} />
            <span>Create Content</span>
          </Link>
        </li>

        {/* Generate Audio */}
        <li>
          <Link
            to="/generate-audio"
            className={`flex items-center gap-3 p-3 rounded transition-all duration-300 ${
              location.pathname === "/generate-audio" ? "bg-gray-200 text-orange-500" : "hover:bg-gray-100"
            }`}
          >
            <Headphones className={`${location.pathname === "/generate-audio" ? "text-orange-500" : ""}`} />
            <span>Generate Audio</span>
          </Link>
        </li>
      </ul>
    </motion.div>
  );
}
