import express from "express";
import Post from "../../models/Post.js";
import authMiddleware from "../middleware/authMiddleware.js";



const router = express.Router();

// base route
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Internal Server error", error });
  }
});

// create
router.post("/create", authMiddleware, async (req, res) => {
  const { title, postImage, content, category, createdAt } = req.body;
  //validate request body
  if (!title || !content) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }
  //Create a new post
  const newPost = new Post({ title, postImage, content, category });
  try {
    const savedPost = await newPost.save();
    res.status(201).json({ message: "Post uploaded", savedPost });
  } catch (error) {
    console.error("Error saving post", err);
    res.status(500).json({ message: "Server error", error });
  }
});

// get by id
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.json(post);
  } catch (err) {
    console.error("Error getting post", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// update by id
router.put("/:id", authMiddleware, async (req, res) => {
  //validate request body
  const { title, postImage, content, category } = req.body;

  if (!title && !content && !postImage && !category) {
    return res
      .status(400)
      .json({ message: "Nothing to update please fill in one of the fields" });
  }

  const updateFields = {};
  if (title) updateFields.title = title;
  if (postImage) updateFields.postImage = postImage;
  if (content) updateFields.content = content;
  if (category) updateFields.category = category;
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!updatedPost) {
      return res.status(484).json({ message: "Post not found" });
    }

    res.json({ message: "Post updated", updatedPost });
  } catch (err) {
    console.error("Error updating post", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// delete by id
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error("Error deleting post", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

export default router;
