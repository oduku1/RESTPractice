import express from "express";
import posts from "../data/posts.js";
import comments from "../data/comments.js";

const router = express.Router();

// CREATE a post
router.post("/", (req, res) => {
  if (req.body.userId && req.body.title && req.body.content) {
    const post = {
      id: posts[posts.length - 1].id + 1,
      userId: req.body.userId,
      title: req.body.title,
      content: req.body.content,
    };

    posts.push(post);
    res.json(posts[posts.length - 1]);
  } else {
    res.status(400).json({ error: "Insufficient Data" });
  }
});

// GET a single post by id
router.get("/:id", (req, res) => {
  const post = posts.find((p) => p.id === Number(req.params.id));

  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

// UPDATE (PATCH) a post by id
router.patch("/:id", (req, res) => {
  const post = posts.find((p, i) => {
    if (p.id === Number(req.params.id)) {
      for (const key in req.body) {
        posts[i][key] = req.body[key];
      }
      return true;
    }
  });

  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

// DELETE a post
router.delete("/:id", (req, res) => {
  const postIndex = posts.findIndex((p) => p.id === Number(req.params.id));

  if (postIndex !== -1) {
    const deletedPost = posts.splice(postIndex, 1);
    res.json(deletedPost[0]);
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

// PART 1: Get all posts for a user
router.get("/user/:id", (req, res) => {
  const userId = Number(req.params.id);

  const userPosts = posts.filter((p) => p.userId === userId);

  if (userPosts.length > 0) {
    res.json(userPosts);
  } else {
    res.status(404).json({ error: "No posts found for this user" });
  }
});

// PART 2: Get all posts (optionally filter by userId)
router.get("/", (req, res) => {
  console.log(req.query);
  let userPosts = posts;

  if (req.query.userId) {
    let userId = Number(req.query.userId);
    userPosts = userPosts.filter((p) => p.userId === userId);
  }

  res.json(userPosts);
});

router.get("/:id/comments", (req, res) => {
  const postId = Number(req.params.id);
  let postComments = comments.filter(comment => comment.postId === postId);

  // If a userId query param is provided, filter further
  if (req.query.userId) {
    const userId = Number(req.query.userId);
    postComments = postComments.filter(comment => comment.userId === userId);
  }

  // Handle no matches
  if (postComments.length === 0) {
    return res.status(404).json({
      error: "No comments found for this post (with specified userId if provided)"
    });
  }

  res.json(postComments);
});
export default router;