// routes/comments.js

const router = require('express').Router();
const Comment = require('../models/Comment');

// Add a comment to a post
router.post('/', async (req, res) => {
  const newComment = new Comment(req.body);
  try {
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all comments for a post
router.get('/post/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).populate({
      path: 'userId',
      model: 'temp',
      select: 'username profilePicture',
    });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
