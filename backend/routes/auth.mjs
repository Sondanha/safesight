import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// 회원가입
router.post("/signup", async (req, res) => {
  const { userid, password, verifyPassword, name, phoneNumber, bizNum } =
    req.body;

  if (password !== verifyPassword) {
    return res
      .status(400)
      .send(
        '<script>alert("비밀번호가 일치하지 않습니다.");history.back();</script>'
      );
  }

  try {
    const existing = await User.findOne({ userid });
    if (existing) {
      return res
        .status(400)
        .send(
          '<script>alert("이미 존재하는 아이디입니다.");history.back();</script>'
        );
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      userid,
      password: hashed,
      name,
      phoneNumber,
      bizNum,
    });

    res.redirect("/login.html");
  } catch (err) {
    console.error(err);
    res.status(500).send("회원가입 중 서버 오류");
  }
});

// 회원가입 시 아이디 중복확인
router.get("/check-id", async (req, res) => {
  const { userid } = req.query;

  if (!userid) return res.status(400).json({ message: "아이디가 없습니다." });

  const exists = await User.exists({ userid });
  if (exists) {
    return res.json({
      available: false,
      message: "이미 사용 중인 아이디입니다.",
    });
  }
  return res.json({ available: true, message: "사용 가능한 아이디입니다." });
});

// 로그인
router.post("/login", async (req, res) => {
  const { userid, password } = req.body;
  const user = await User.findOne({ userid });
  if (!user) {
    return res.status(400).json({ message: "존재하지 않는 사용자입니다." });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: "비밀번호가 틀렸습니다." });
  }

  const token = jwt.sign({ userid }, process.env.JWT_SECRET);

  res.json({ message: "로그인 성공", token });
});

router.get("/me", (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(401).json({ loggedIn: false });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ loggedIn: false });
    res.json({ loggedIn: true, user: decoded });
  });
});

export default router;
