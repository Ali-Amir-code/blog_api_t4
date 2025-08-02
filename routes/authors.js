import { Router } from 'express';
import auth from '../middleware/auth.js';
import Author from '../models/Author.js';
const router = Router();

// GET /authors
router.get('/', auth, async (req, res, next) => {
  try {
    const authors = await Author.find().select('-password');
    res.json(authors);
  } catch (err) { next(err); }
});

// GET /authors/:id
router.get('/:id', auth, async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.id).select('-password');
    if (!author) return res.status(404).json({ msg: 'Author not found' });
    res.json(author);
  } catch (err) { next(err); }
});

export default router;
