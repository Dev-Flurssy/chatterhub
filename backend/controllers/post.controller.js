import path from "path";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import errorHandler from "../helpers/dbErrorHandler.js";
import { trackEvent, getSessionId } from "../middleware/analytics.middleware.js";

const create = async (req, res) => {
  const post = new Post(req.body);
  post.postedBy = req.auth._id;

  // Handle file upload (photo or video) from upload.any()
  if (req.files && req.files.length > 0) {
    const file = req.files[0];
    const fileUrl = `/uploads/${file.filename}`;
    
    if (file.mimetype.startsWith('image/')) {
      post.photo = fileUrl;
      post.mediaType = 'photo';
    } else if (file.mimetype.startsWith('video/')) {
      post.video = fileUrl;
      post.mediaType = 'video';
    }
  }

  try {
    let result = await post.save();
    result = await result.populate("postedBy", "_id name profilePic");
    
    // Track post creation event
    const sessionId = getSessionId(req);
    trackEvent('post', req.auth._id, sessionId, { postId: result._id });
    
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

// List all posts
const list = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("postedBy", "_id name profilePic")
      .populate("comments.postedBy", "_id name profilePic")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const listAll = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("postedBy", "_id name")
      .sort({ createdAt: -1 }); // newest first
    res.json(posts);
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve posts",
    });
  }
};

// Get posts by a specific user
const postsByUser = async (req, res) => {
  try {
    const posts = await Post.find({ postedBy: req.profile._id })
      .populate("postedBy", "_id name profilePic")
      .populate("comments.postedBy", "_id name profilePic")
      .sort("-createdAt")
      .exec();
    res.json(posts);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const photo = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).select("photo");
    if (post?.photo?.data) {
      res.set("Content-Type", post.photo.contentType);
      return res.send(post.photo.data);
    }
    const __dirname = path.resolve();
    return res.sendFile(
      path.join(__dirname, "public", "uploads", "defaultphoto.png")
    );
  } catch (err) {
    return res.status(404).json({ error: "Photo not found" });
  }
};

// Like a post
const like = async (req, res) => {
  try {
    const result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $addToSet: { likes: req.auth._id } },
      { new: true }
    )
      .populate("postedBy", "_id name profilePic")
      .populate("comments.postedBy", "_id name profilePic");

    // Track like event
    const sessionId = getSessionId(req);
    trackEvent('like', req.auth._id, sessionId, { postId: req.body.postId });

    res.json(result);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

// Unlike a post
const unlike = async (req, res) => {
  try {
    const result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $pull: { likes: req.auth._id } },
      { new: true }
    )
      .populate("postedBy", "_id name profilePic")
      .populate("comments.postedBy", "_id name profilePic");

    res.json(result);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

// Comment on a post
const comment = async (req, res) => {
  const comment = {
    text: req.body.comment.text,
    postedBy: req.auth._id,
  };

  try {
    const result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $push: { comments: comment } },
      { new: true }
    )
      .populate("comments.postedBy", "_id name profilePic")
      .populate("postedBy", "_id name profilePic");

    // Track comment event
    const sessionId = getSessionId(req);
    trackEvent('comment', req.auth._id, sessionId, { postId: req.body.postId });

    res.json(result);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

// Uncomment a post
const uncomment = async (req, res) => {
  try {
    const result = await Post.findByIdAndUpdate(
      req.body.postId,
      { $pull: { comments: { _id: req.body.comment._id } } },
      { new: true }
    )
      .populate("comments.postedBy", "_id name profilePic")
      .populate("postedBy", "_id name profilePic");

    res.json(result);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

// Read a single post
const read = (req, res) => res.json(req.post);

// Delete a post
const remove = async (req, res) => {
  try {
    const deletedPost = await req.post.deleteOne();
    res.json(deletedPost);
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

// Middleware: get post by ID
const postByID = async (req, res, next, id) => {
  try {
    const post = await Post.findById(id)
      .populate("postedBy", "_id name profilePic")
      .populate("comments.postedBy", "_id name profilePic");

    if (!post) return res.status(404).json({ error: "Post not found" });
    req.post = post;
    next();
  } catch (err) {
    return res.status(400).json({ error: "Could not retrieve post" });
  }
};

// Check if user owns post
const isPoster = (req, res, next) => {
  const isPoster =
    req.post &&
    req.auth &&
    req.post.postedBy._id.toString() === req.auth._id.toString();

  if (!isPoster) {
    return res.status(403).json({ error: "User is not authorized" });
  }
  next();
};

const userByID = async (req, res, next, id) => {
  try {
    const user = await User.findById(id)
      .select("-password") // exclude password
      .populate("followers", "_id name email") // include minimal info of followers
      .populate("following", "_id name email"); // optional, if you want following list

    if (!user) return res.status(400).json({ error: "User not found" });

    req.profile = user;
    next();
  } catch (err) {
    return res.status(400).json({ error: "Could not retrieve user" });
  }
};

const listNewsFeed = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select("following")
      .lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    const followingIds = user.following || [];
    followingIds.push(req.params.userId); // include self

    const posts = await Post.find({ postedBy: { $in: followingIds } })
      .populate("postedBy", "_id name profilePic")
      .populate("comments.postedBy", "_id name profilePic")
      .sort({ createdAt: -1 })
      .lean();

    const enrichedPosts = posts.map((p) => ({
      ...p,
      likeCount: p.likes?.length || 0,
      commentCount: p.comments?.length || 0,
    }));

    res.setHeader("Cache-Control", "no-store");
    res.json(enrichedPosts);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Could not load feed." });
  }
};

const searchPosts = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.trim().length === 0) {
      return res.json([]);
    }

    const searchRegex = new RegExp(query, 'i');
    
    const posts = await Post.find({
      text: searchRegex,
    })
      .populate('postedBy', '_id name profilePic')
      .populate('comments.postedBy', '_id name profilePic')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(posts);
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

export default {
  create,
  list,
  listAll,
  postsByUser,
  photo,
  like,
  unlike,
  comment,
  uncomment,
  read,
  remove,
  postByID,
  isPoster,
  userByID,
  listNewsFeed,
  searchPosts,
};
