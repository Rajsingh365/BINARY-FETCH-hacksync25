import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.util.js";
import Listener from "../models/listener.model.js";
import Podcast from "../models/podcast.model.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return res.status(400).json({ error: "Please enter email and password" });
    }

    const user = await Listener.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Compare passwords
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate token & set cookie
    const token = generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      email: user.email,
      genres: user.genres,
      token,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, preferences } = req.body;
    console.log({ name, email, password, preferences });

    // Validate required fields
    if (!name || !email || !password || !preferences?.length) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    // Check if email already exists
    const existingUser = await Listener.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await Listener.create({
      name,
      email,
      password: hashPassword,
      preferences,
    });

    if (newUser) {
      // Generate token & set cookie
      const token = generateTokenAndSetCookie(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        preferences: newUser.preferences,
        token,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getListener = async (req, res) => {
  const user = await Listener.findOne({ _id: req.user.userId });
  res.json({ user });
};

export const likePodcast = async (req, res) => {
  const podcastId = req.params.id;
  const userId = req.user.userId;
  const podcast = await Podcast.findOne({ _id: podcastId });
  if (!podcast) {
    return res.status(400).json({ msg: "Invalid podcast id" });
  }
  const user = await Listener.findOne({ _id: userId });
  user.liked.push(podcastId);
  await user.save();
  res.json({ user });
};
