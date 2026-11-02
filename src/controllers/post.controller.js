import mongoose from 'mongoose';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';

/**
 * @desc    Create a new post
 * @route   POST /api/posts
 * @access  Public
 */
export const createPost = async (req, res) => {
  try {
    const { title, content, author } = req.body;

    // Validate fields
    if (!title || !content || !author) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, content, and author (User ID)',
      });
    }

    // Validate if author is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(author)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid author ID format',
      });
    }

    // Verify author exists in database
    const userExists = await User.findById(author);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: 'Author user does not exist',
      });
    }

    // Create post
    const newPost = await Post.create({
      title,
      content,
      author,
    });

    const populatedPost = await newPost.populate('author', 'username email');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: populatedPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while creating post',
      error: error.message,
    });
  }
};

/**
 * @desc    Get all posts
 * @route   GET /api/posts
 * @access  Public
 */
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving posts',
      error: error.message,
    });
  }
};

/**
 * @desc    Get a single post by ID
 * @route   GET /api/posts/:id
 * @access  Public
 */
export const getPostById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid post ID format',
      });
    }

    const post = await Post.findById(req.params.id).populate(
      'author',
      'username email'
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: `Post not found with id: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving post',
      error: error.message,
    });
  }
};

/**
 * @desc    Update a post by ID
 * @route   PUT /api/posts/:id
 * @access  Public
 */
export const updatePost = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid post ID format',
      });
    }

    const { title, content } = req.body;

    if (!title && !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least a title or content to update',
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: `Post not found with id: ${req.params.id}`,
      });
    }

    if (title) post.title = title;
    if (content) post.content = content;

    const updatedPost = await post.save();
    const populated = await updatedPost.populate('author', 'username email');

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: populated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating post',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete a post by ID
 * @route   DELETE /api/posts/:id
 * @access  Public
 */
export const deletePost = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid post ID format',
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: `Post not found with id: ${req.params.id}`,
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting post',
      error: error.message,
    });
  }
};
