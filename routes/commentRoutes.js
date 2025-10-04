import express from "express";
import comments from "../data/comments.js";
import users from "../data/users.js";
import posts from "../data/posts.js";

const router = express.Router();

router.post("/", (req, res) => {
  const { userId, postId, body } = req.body;

  if (!userId | !postId | !body) {
    return res.status(400).json({ error: "Invalid data for comments" });
  }

  const user = users.find((user) => user.id === Number(userId));
  if (!user) {
    return res.status(404).json({ error: "User Not FOUND" });
  }

  const userPost = posts.find((post) => post.id === Number(postId));
  if (!userPost) {
    return res.status(404).json({ error: "POST Not FOUND" });
  }

  const comment = {
    id: comments.length > 0 ? comments[comments.length - 1].id + 1 : 1,
    userId: Number(userId),
    postId: Number(postId),
    body,
  };

  comments.push(comment);
  res.json(comment);
});

router
  .route("/")
  .get((req, res) => {
    const {userId,postId} = req.query;

    if (userId) {
      const userComments = comments.filter(comment => comment.userId === Number(userId));
      res.json(userComments);
    } 
    if (postId) {
        const userComments = comments.filter(comment => comment.postId === Number(postId));
        res.json(userComments);
      } 

      res.json(comments);

  })

router
  .route("/:id")
  .get((req, res) => {
    let id = Number(req.params.id);
    let comment = comments.find((comment) => comment.id === id);
    if (comment) {
      res.json(comment);
    } else {
      res.status(404).json({ error: "Comment not found" });
    }
  })
  .patch((req, res) => {
    let id = Number(req.params.id);
    let comment = comments.find((comment) => comment.id === id);
    if(comment){
        comment.body = req.body.body
    }
    else{
        res.status(404).json({ error: "Comment not found" });
    }
    res.json({message:"Comment updated to", comment})

  })
  .delete((req, res) => {
    let id = Number(req.params.id);
    let comment = comments.find(comment => comment.id === id);

    if (comment) {
        let index = comments.indexOf(comment);
        comments.splice(index, 1); // Delete just 1 comment
        res.json({ message: "Comment deleted", comment });
    } else {
        res.status(404).json({ message: "Comment not found" });
    }
});

export default router;
