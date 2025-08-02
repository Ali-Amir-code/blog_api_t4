import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import auth from '../middleware/auth.js';
import Post from '../models/Post.js';

const router = Router();

// GET /posts?limit=10&page=2
router.get('/', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page  = parseInt(req.query.page)  || 1;
    const posts = await Post.find()
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .skip((page-1)*limit)
      .limit(limit);
    res.json(posts);
  } catch (err) { next(err); }
});

// GET /posts/:id
router.get('/:id', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name');
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    res.json(post);
  } catch (err) { next(err); }
});

// POST /posts
router.post(
  '/',
  auth,
  body('title').notEmpty(),
  body('content').notEmpty(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const post = new Post({ ...req.body, author: req.author.id });
      await post.save();
      res.status(201).json(post);
    } catch (err) { next(err); }
  }
);

// PUT /posts/:id
router.put(
  '/:id',
  auth,
  body('title').optional().notEmpty(),
  body('content').optional().notEmpty(),
  async (req, res, next) => {
    try {
      let post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ msg: 'Post not found' });
      if (post.author.toString() !== req.author.id)
        return res.status(403).json({ msg: 'Not authorized' });
      post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(post);
    } catch (err) { next(err); }
  }
);

// DELETE /posts/:id
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    if (post.author.toString() !== req.author.id)
      return res.status(403).json({ msg: 'Not authorized' });
    await post.remove();
    res.json({ msg: 'Post removed' });
  } catch (err) { next(err); }
});

export default router;
