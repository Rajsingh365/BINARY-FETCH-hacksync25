import { useState } from "react";
import { Link, useNavigate } from "react-router";
import useLogin from "../hooks/useLogin";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loading, login } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(username, password);
    if(success) navigate("/profile");
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div className="md:w-1/3 border-2 border-[#6F4DF7] rounded-xl p-6 bg-gray-900">
        <h1 className="text-3xl font-semibold text-center text-gray-300">
          Login <span className="text-blue-500">iConnect</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="johndoe"
              className="w-full px-4 py-2 text-gray-300 bg-gray-800 border border-gray-600 rounded-lg focus:ring focus:ring-[#6F4DF7] outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full px-4 py-2 text-gray-300 bg-gray-800 border border-gray-600 rounded-lg focus:ring focus:ring-[#6F4DF7] outline-none"
            />
          </div>

          <div className="flex gap-2 items-center mt-2 mb-2">
            <p className="text-sm text-gray-400">Don't have an account?</p>
            <Link className="text-sm text-blue-500 hover:underline" to="/signup">
              Signup
            </Link>
          </div>

          <button
            className={`w-full py-2 text-white bg-[#6F4DF7] rounded-lg transition-all duration-200 ease-in-out ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#5a3bd1]"
            }`}
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner text-white"></span>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};