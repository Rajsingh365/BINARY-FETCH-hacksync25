import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";




function useLogin() {
  const [loading, setLoading] = useState(false);
  const {setAuthUser,setAuthToken} = useAuthContext();

  const login = async(username,password) => {
    const success = handleInputErrors(username,password);

    if(!success) return false;
    setLoading(true);

    try{
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/auth/login`,{
        method: "Post",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({username,password}),
      });
      const data = await res.json();
      if(data.error) {
        throw new Error(data.error);
      }
      const { token, ...userdata } = data;
      localStorage.setItem("loggedin_user", JSON.stringify(userdata));
      localStorage.setItem("Hacks25-jwt", JSON.stringify(token));
      setAuthUser(userdata);
      setAuthToken(token);

      return true;

    } catch(error){
      toast.error(error.message);
      return false;
    }finally{
      setLoading(false);
    }
  }

  return{loading,login};

}

export default useLogin;

function handleInputErrors(username,password) {
  if(!username || !password) {
    toast.error("Please fill in all the fields")
    return false;
  }

  if(password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return false;
  }

  return true;
}