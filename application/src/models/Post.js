import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    match: [/^[a-zA-Z0-9\s]+$/, "Only alphanumeric characters and underscores"],
  },
  postImage: {
    type: String,
    required: false,
    trim: true,
    default: "https://www.trschools.com/templates/imgs/default_placeholder.png",
    match: [/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/, "invalid url"], // Basic URL pattern
  },
  content: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 20000,
  },
  category: {
    type: String,
    required: true,
    enum: ["Pending", "Technology", "Health", "Business", "Entertainment"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
});

export default mongoose.model("Post", postSchema);
