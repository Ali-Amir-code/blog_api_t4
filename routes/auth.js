import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { genSalt, hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Author from '../models/Author.js';
const router = Router();

// POST /auth/register
router.post(
  '/register',
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      let author = await Author.findOne({ email: req.body.email });
      if (author) return res.status(400).json({ msg: 'Email already in use' });
      author = new Author(req.body);
      const salt = await genSalt(10);
      author.password = await hash(req.body.password, salt);
      await author.save();
      const payload = { author: { id: author.id } };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } catch (err) { next(err); }
  }
);

// POST /auth/login
router.post(
  '/login',
  body('email').isEmail(),
  body('password').exists(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const { email, password } = req.body;
      const author = await Author.findOne({ email });
      if (!author) return res.status(400).json({ msg: 'Invalid credentials' });
      const isMatch = await compare(password, author.password);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
      const payload = { author: { id: author.id } };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } catch (err) { next(err); }
  }
);

export default router;
