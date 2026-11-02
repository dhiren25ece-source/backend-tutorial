import express from 'express';
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  deleteUser,
} from '../controllers/user.controller.js';

const router = express.Router();

// User Authentication
router.post('/register', registerUser);
router.post('/login', loginUser);

// User Management
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.delete('/:id', deleteUser);

export default router;
