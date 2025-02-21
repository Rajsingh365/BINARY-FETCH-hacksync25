import { useState } from "react";
import { Link, useNavigate } from "react-router";
import useSignup from "../hooks/useSignup";

export const Signup = () => {
  const [inputs, setInputs] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const { loading, signup } = useSignup();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await signup(inputs);
    if (success) navigate("/home");
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div className="w-full max-w-md p-8 bg-gray-900 border border-[#6F4DF7] rounded-xl shadow-lg">
        <h1 className="text-4xl font-semibold text-center text-gray-200 mb-6">
          Sign Up <span className="text-blue-500">iConnect</span>
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-2">Full Name</label>
            <input
              type="text"
              value={inputs.fullName}
              placeholder="John Doe"
              className="w-full px-4 py-2 text-gray-300 bg-gray-800 border border-gray-600 rounded-lg focus:ring focus:ring-[#6F4DF7] outline-none"
              onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-2">Username</label>
            <input
              type="text"
              value={inputs.username}
              placeholder="johndoe"
              className="w-full px-4 py-2 text-gray-300 bg-gray-800 border border-gray-600 rounded-lg focus:ring focus:ring-[#6F4DF7] outline-none"
              onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-2">Password</label>
            <input
              type="password"
              value={inputs.password}
              placeholder="Enter Password"
              className="w-full px-4 py-2 text-gray-300 bg-gray-800 border border-gray-600 rounded-lg focus:ring focus:ring-[#6F4DF7] outline-none"
              onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-2">Confirm Password</label>
            <input
              type="password"
              value={inputs.confirmPassword}
              placeholder="Confirm Password"
              className="w-full px-4 py-2 text-gray-300 bg-gray-800 border border-gray-600 rounded-lg focus:ring focus:ring-[#6F4DF7] outline-none"
              onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
            />
          </div>

          <div className="flex gap-6 mb-6">
            <div className="flex items-center">
              <input
                type="radio"
                checked={inputs.gender === "male"}
                className="mr-2"
                onChange={() => setInputs({ ...inputs, gender: "male" })}
              />
              <label className="text-gray-400">Male</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                checked={inputs.gender === "female"}
                className="mr-2"
                onChange={() => setInputs({ ...inputs, gender: "female" })}
              />
              <label className="text-gray-400">Female</label>
            </div>
          </div>

          <div className="flex gap-3 items-center mb-4">
            <p className="text-sm text-gray-400">Already have an account?</p>
            <Link className="text-sm text-blue-500 hover:underline" to="/login">
              Sign In
            </Link>
          </div>

          <button
            className={`w-full py-2 text-center text-white bg-[#6F4DF7] rounded-lg transition-all duration-200 ease-in-out ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#5a3bd1]"
            }`}
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner text-white"></span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};