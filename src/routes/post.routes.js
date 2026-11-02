import express from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from '../controllers/post.controller.js';

const router = express.Router();

// Full CRUD Endpoints for Posts
router.post('/', createPost);         // CREATE
router.get('/', getAllPosts);         // READ ALL
router.get('/:id', getPostById);      // READ ONE
router.put('/:id', updatePost);       // UPDATE
router.delete('/:id', deletePost);    // DELETE

export default router;
