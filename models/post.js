import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  caption: {
    type: String,
    trim: true,
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  tags: {
    type: String,
  },

  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      comment: {
        type: String,
        required: true,
        trim: true,
      },
      commentedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const postModel = mongoose.model("Post", postSchema);

export default postModel;