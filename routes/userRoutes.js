import express from "express";
import users from "../data/users.js";
import comments from "../data/comments.js";

const router = express.Router();

// GET all users
router.get("/", (req, res) => {
  res.json(users);
});

// CREATE a user
router.post("/", (req, res) => {
  if (req.body.name && req.body.username && req.body.email) {
    // prevent duplicate usernames
    if (users.find((u) => u.username === req.body.username)) {
      return res.status(400).json({ error: "Username Already Taken" });
    }

    const user = {
      id: users[users.length - 1].id + 1,
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
    };

    users.push(user);
    res.json(users[users.length - 1]);
  } else {
    res.status(400).json({ error: "Insufficient Data" });
  }
});

// GET single user by id
router.get("/:id", (req, res) => {
  const user = users.find((u) => u.id === Number(req.params.id));

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// UPDATE user (PATCH)
router.patch("/:id", (req, res) => {
  const user = users.find((u, i) => {
    if (u.id === Number(req.params.id)) {
      for (const key in req.body) {
        users[i][key] = req.body[key];
      }
      return true;
    }
  });

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// DELETE user
router.delete("/:id", (req, res) => {
  const userIndex = users.findIndex((u) => u.id === Number(req.params.id));

  if (userIndex !== -1) {
    const deletedUser = users.splice(userIndex, 1);
    res.json(deletedUser[0]);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});


router.get("/users/:id/comments", (req, res) => {
    const userId = Number(req.params.id);
    let userComments = comments.filter(comment => comment.userId === userId);
  
    if (userComments.length === 0) {
      return res.status(404).json({ error: "No comments found for this user id" });
    }
  
    if (req.query.postId) {
      const postId = Number(req.query.postId);
      userComments = userComments.filter(comment => comment.postId === postId);
  
      if (userComments.length === 0) {
        return res.status(404).json({ error: "No comments found for this user on the specified post" });
      }
    }
  
    res.json(userComments);
  });


export default router;