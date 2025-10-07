const News = require('../models/News.model');

const NewsController = {
  createPost: async (req, res) => {
    try {
      const { title, content, author, date } = req.body;
      const images = req.files.map(file => file.path.replace(/\\/g, '/')); // 경로 수정

      const newPost = new News({ title, content, images, author, date });
      await newPost.save();

      res.status(200).json({ status: 'success', data: newPost });
    } catch (error) {
      res.status(500).json({ status: 'fail', message: error.message });
    }
  },

  getAllPosts: async (req, res) => {
    try {
      const posts = await News.find();
      res.status(200).json({ status: 'success', data: posts });
    } catch (error) {
      res.status(500).json({ status: 'fail', message: error.message });
    }
  },

  updatePost: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content } = req.body;
      let images = req.body.existingImages || [];

      if (req.files.length > 0) {
        const newImages = req.files.map(file => file.path.replace(/\\/g, '/'));
        images = images.concat(newImages);
      }

      const updatedPost = await News.findByIdAndUpdate(
        id,
        { title, content, images },
        { new: true, runValidators: true }
      );

      if (!updatedPost) {
        return res.status(404).json({ status: 'fail', message: 'Post not found' });
      }

      res.status(200).json({ status: 'success', data: updatedPost });
    } catch (error) {
      res.status(500).json({ status: 'fail', message: error.message });
    }
  },

  deletePost: async (req, res) => {
    try {
      const postId = req.params.id;
      const deletedPost = await News.findByIdAndDelete(postId);

      if (!deletedPost) {
        return res.status(404).json({ status: 'fail', message: 'Post not found' });
      }

      res.status(200).json({ status: 'success', message: 'Post deleted successfully' });
    } catch (error) {
      res.status(500).json({ status: 'fail', error: error.message });
    }
  },
};

module.exports = NewsController;
