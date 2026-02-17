const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,    
        required: [true, "Username is required"],
        unique: true,
    },    
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength:[6, "Password must be at least 6 characters long"]
    },
    email: {
         type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
});

module.exports = {
    User: mongoose.model("User", userSchema),
    }