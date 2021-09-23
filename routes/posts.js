import express from "express";
import {
  createPost,
  deletePost,
  fetchPosts,
  likePost,
  updatePost,
} from "../controllers/posts.js";

const router = express.Router();

router.get("/", fetchPosts);
router.post("/", createPost);
router.patch("/:id", updatePost);
router.delete("/:id", deletePost);
router.patch("/:id/likePost", likePost);

export default router;
