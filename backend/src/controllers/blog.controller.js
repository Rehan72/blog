const { Blog } = require("../models/blog.model");

async function createBlogController(req, res) {
  try {
    const { title, content, tags, image } = req.body;
    const author = req.user.userId;
    const newBlog = new Blog({ title, content, author, tags, image });
    await newBlog.save();
    res.status(201).json({ message: "Blog created successfully", blog: newBlog });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ error: "Failed to create blog" });
  }
}

async function getBlogsController(req, res) {
  try {
    const blogs = await Blog.find().populate("author", "username").sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
}

async function getBlogByIdController(req, res) {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "username");
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ error: "Failed to fetch blog" });
  }
}

async function updateBlogController(req, res) {
  try {
    const { title, content, tags, image } = req.body;
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    // Check if author exists and matches the user
    if (blog.author && blog.author.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ error: "Not authorized to update this blog" });
    }
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.tags = tags || blog.tags;
    blog.image = image || blog.image;
    await blog.save();
    res.json({ message: "Blog updated successfully", blog });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ error: "Failed to update blog" });
  }
}

async function deleteBlogController(req, res) {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    // Check if author exists and matches the user
    if (blog.author && blog.author.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ error: "Not authorized to delete this blog" });
    }
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ error: "Failed to delete blog" });
  }
}

module.exports = {
  createBlogController,
  getBlogsController,
  getBlogByIdController,
  updateBlogController,
  deleteBlogController,
};