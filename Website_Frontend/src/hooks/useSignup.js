import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

function useSignup() {
  const [loading, setLoading] = useState(false);
  const { setAuthUser, setAuthToken } = useAuthContext();

  const signup = async ({ email, password, confirmPassword, preferences }) => {
    const success = handleInputErrors({ email, password, confirmPassword, preferences });
    if (!success) return false;

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, confirmPassword, preferences }),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      const { token, ...userData } = data;
      localStorage.setItem("loggedin_user", JSON.stringify(userData));
      localStorage.setItem("Hacks25-jwt", JSON.stringify(token));
      setAuthUser(userData);
      setAuthToken(token);

      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, signup };
}

export default useSignup;

function handleInputErrors({ email, password, confirmPassword, preferences }) {
  if (!email || !password || !confirmPassword || preferences.length === 0) {
    toast.error("Please fill in all fields and select at least one preference");
    return false;
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    toast.error("Invalid email format");
    return false;
  }

  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return false;
  }

  if (password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return false;
  }

  return true;
}
