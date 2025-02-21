import { Routes, Route } from "react-router";
import { HomeLayout } from "./pages/HomeLayout";
import { Landing } from "./pages/Landing";
import { ContactUs } from "./pages/ContactUs";
import { AboutUs } from "./pages/AboutUs";
// import { Signup } from "./pages/Signup";
// import { Login } from "./pages/Login";
// import { Profile } from "./pages/Profile";
import { Toaster } from "react-hot-toast";
import { AuthContextProvider } from "./context/AuthContext";


function App() {
  return (
    <>
    <AuthContextProvider>
      <Routes>
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<Landing />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          {/* <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} /> */}
        </Route> 
      </Routes>

      <Toaster />
    </AuthContextProvider>
    </>
  );
}

export default App;