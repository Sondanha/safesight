import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "토큰 없음" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // userid, name 등이 포함됨
    next();
  } catch (err) {
    return res.status(403).json({ message: "유효하지 않은 토큰" });
  }
}
