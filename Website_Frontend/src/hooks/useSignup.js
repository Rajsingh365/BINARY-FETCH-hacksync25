import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";




function useSignup() {
  const [loading, setLoading] = useState(false);
  const { setAuthUser,setAuthToken } = useAuthContext();


  const signup = async ({ fullName, username, password, confirmPassword, gender }) => {
    const success = handleInputErrors({ fullName, username, password, confirmPassword, gender });

    if (!success) return false;
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/auth/signup`, {
        method: "Post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, username, password, confirmPassword, gender }),
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      const { token, ...userdata } = data;
      localStorage.setItem("loggedin_user", JSON.stringify(userdata));
      localStorage.setItem("Hacks25-jwt", JSON.stringify(token));
      setAuthUser(userdata);
      setAuthToken(token);
      return true;

    } catch (error) {
      toast.error(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { loading, signup };

}

export default useSignup

function handleInputErrors({ fullName, username, password, confirmPassword, gender }) {
  if (!fullName || !username || !password || !confirmPassword || !gender) {
    toast.error("Please fill in all the fields")
    return false;
  }
  if (password != confirmPassword) {
    toast.error("Password do not match");
    return false;
  }
  if (password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return false;
  }

  return true;
}