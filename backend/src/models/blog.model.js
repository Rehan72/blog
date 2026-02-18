const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
    },
    content: {
        type: String,
        required: [true, "Content is required"],
    },
    author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  tags: [String],
  image: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = {
    Blog: mongoose.model("Blog", blogSchema),
}