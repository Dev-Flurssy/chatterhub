import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: "Comment text is required",
      trim: true,
    },
    postedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: "Post text is required",
      trim: true,
    },
    photo: {
      type: String, // URL to uploaded photo
    },
    video: {
      type: String, // URL to uploaded video
    },
    mediaType: {
      type: String,
      enum: ['photo', 'video', 'none'],
      default: 'none',
    },
    postedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [commentSchema],
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

postSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

postSchema.virtual("commentCount").get(function () {
  return this.comments.length;
});

postSchema.index({ postedBy: 1, createdAt: -1 });

export default mongoose.model("Post", postSchema);
