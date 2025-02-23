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
import Webinar from "./pages/Webinar";
import Tutorials from "./pages/Tutuorials";
import Community from "./pages/Community";
import PodcasterHub from "./pages/PodcasterHub";
import OtherPodcastersProfile from "./pages/OtherPodcastersProfile";

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
              <Route path="/webinars" element={<Webinar />} />
              <Route path="/tutorials" element={<Tutorials />} />
              <Route path="/community" element={<Community />} />
              <Route path="/podcaster-hub" element={<PodcasterHub />} />
              <Route path="/other-podcaster-hub/:user_id" element={<OtherPodcastersProfile />} />

              {/* <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} /> */}
            </Route>
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
          </Routes>

          <Toaster />
        </ScriptContextProvider>
      </AuthContextProvider>
    </>
  );
}
export default App;
