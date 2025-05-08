import express from "express";
import Post from "../models/post.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 게시글 작성
router.post("/", verifyToken, async (req, res) => {
  const { content } = req.body;
  const userid = req.user.userid;

  if (!content || !userid) {
    return res.status(400).json({ message: "내용이 비어 있습니다." });
  }

  try {
    const post = await Post.create({ userid, content });
    res.status(201).json({ message: "게시글 작성 완료", post });
  } catch (err) {
    res.status(500).json({ message: "서버 오류", error: err.message });
  }
});

// 게시글 목록 조회
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "조회 실패", error: err.message });
  }
});

// 글 삭제 (본인만)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "게시글 없음" });

    if (post.userid !== req.user.userid) {
      return res.status(403).json({ message: "권한 없음" });
    }

    await post.deleteOne();
    res.json({ message: "삭제 완료" });
  } catch (err) {
    res.status(500).json({ message: "삭제 실패", error: err.message });
  }
});

// 글 수정 (본인만)
router.put("/:id", verifyToken, async (req, res) => {
  const { content } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "게시글 없음" });

    if (post.userid !== req.user.userid) {
      return res.status(403).json({ message: "권한 없음" });
    }

    post.content = content;
    await post.save();
    res.json({ message: "수정 완료", post });
  } catch (err) {
    res.status(500).json({ message: "수정 실패", error: err.message });
  }
});

export default router;
