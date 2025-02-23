import { Routes, Route } from "react-router";
import { HomeLayout } from "./pages/HomeLayout";
import { Landing } from "./pages/Landing";
import { ContactUs } from "./pages/ContactUs";
import { AboutUs } from "./pages/AboutUs";
import { Signup } from "./pages/Signup";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";
import { Toaster } from "react-hot-toast";
import { AuthContextProvider } from "./context/AuthContext";
import GenerateAudio from "./pages/GenerateAudio";
import GenerateContent from "./pages/GenerateContent";
import { ScriptContextProvider } from "./context/ScriptContext";
import Dashboard from "./pages/Dashboard";
import AudioLoader from "./components/AudioLoader";

function App() {
  return (
    <>
      <AuthContextProvider>
        <ScriptContextProvider>
          <Routes>
            <Route path="/" element={<HomeLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/generate-content" element={<GenerateContent />} />
              <Route path="/generate-audio" element={<GenerateAudio />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/loader" element={<AudioLoader />} />
          </Routes>

          <Toaster />
        </ScriptContextProvider>
      </AuthContextProvider>
    </>
  );
}
export default App;
