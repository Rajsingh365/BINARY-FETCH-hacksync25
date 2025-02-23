import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Token not provided" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }

  const { userId } = jwt.decode(token);
  console.log(userId);
  req.user = { userId };
  next();
};
