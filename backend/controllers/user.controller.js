import mongoose from "mongoose";
import User from "../models/user.model.js";
import extend from "lodash/extend.js";
import errorHandler from "../helpers/dbErrorHandler.js";
import path from "path";
import fs from "fs";
import { trackEvent, getSessionId } from "../middleware/analytics.middleware.js";

const __dirname = path.resolve();

const sanitizeUser = (user) => {
  if (!user) return null;
  const obj = user.toObject ? user.toObject() : user;
  return {
    _id: obj._id,
    name: obj.name,
    email: obj.email,
    role: obj.role,
    about: obj.about,
    profilePic: obj.profilePic,
    following: obj.following,
    followers: obj.followers,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};

const create = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(sanitizeUser(user));
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const list = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users.map(sanitizeUser));
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const userByID = async (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: `Invalid user ID: ${id}` });
  }
  try {
    const user = await User.findById(id)
      .populate("following", "_id name")
      .populate("followers", "_id name")
      .exec();
    if (!user) return res.status(404).json({ error: "User not found" });
    req.profile = user;
    next();
  } catch (err) {
    return res.status(500).json({ error: "Could not retrieve user" });
  }
};

const read = (req, res) => res.json(sanitizeUser(req.profile));

const addFollowing = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.auth._id, {
      $addToSet: { following: req.body.userId },
    });
    next();
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const addFollower = async (req, res) => {
  try {
    const result = await User.findByIdAndUpdate(
      req.body.userId,
      { $addToSet: { followers: req.auth._id } },
      { new: true }
    )
      .populate("following", "_id name profilePic")
      .populate("followers", "_id name profilePic")
      .exec();

    // Track follow event
    const sessionId = getSessionId(req);
    trackEvent('follow', req.auth._id, sessionId, { followedUserId: req.body.userId });

    res.json(sanitizeUser(result));
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const findPeople = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    let following = currentUser.following || [];
    // Exclude current user and people they're already following
    const excludeIds = [...following, currentUser._id];

    let users = await User.find({ _id: { $nin: excludeIds } })
      .select("name email about profilePic followers following")
      .limit(20);
    
    res.json(users.map(sanitizeUser));
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const removeFollowing = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.auth._id, {
      $pull: { following: req.body.userId },
    });
    next();
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const removeFollower = async (req, res) => {
  try {
    const result = await User.findByIdAndUpdate(
      req.body.userId,
      { $pull: { followers: req.auth._id } },
      { new: true }
    )
      .populate("following", "_id name profilePic")
      .populate("followers", "_id name profilePic")
      .exec();

    // Track unfollow event
    const sessionId = getSessionId(req);
    trackEvent('unfollow', req.auth._id, sessionId, { unfollowedUserId: req.body.userId });

    res.json(sanitizeUser(result));
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const photo = (req, res) => {
  const user = req.profile;
  if (user?.profilePic) {
    const photoPath = path.join(__dirname, "public", user.profilePic);
    if (fs.existsSync(photoPath)) return res.sendFile(photoPath);
  }
  const defaultPath = path.join(__dirname, "public/uploads/defaultphoto.png");
  if (fs.existsSync(defaultPath)) return res.sendFile(defaultPath);

  const transparentPng = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AArsB9VVpHgAAAABJRU5ErkJggg==",
    "base64"
  );
  res.set("Content-Type", "image/png");
  return res.send(transparentPng);
};

const defaultPhoto = (req, res) => {
  const defaultPath = path.join(__dirname, "public/uploads/defaultphoto.png");
  if (fs.existsSync(defaultPath)) return res.sendFile(defaultPath);

  const transparentPng = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AArsB9VVpHgAAAABJRU5ErkJggg==",
    "base64"
  );
  res.set("Content-Type", "image/png");
  return res.send(transparentPng);
};

const update = async (req, res) => {
  try {
    let user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Update basic fields
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.about !== undefined) user.about = req.body.about;
    
    // Update password if provided
    if (req.body.password) {
      const bcrypt = await import('bcrypt');
      user.hashed_password = await bcrypt.default.hash(req.body.password, 10);
    }

    // Handle file upload (photo)
    if (req.file) {
      const fileUrl = `/uploads/${req.file.filename}`;
      user.profilePic = fileUrl;
    }

    user.updatedAt = Date.now();
    await user.save();
    
    // Populate and return
    const updatedUser = await User.findById(user._id)
      .populate("following", "_id name profilePic")
      .populate("followers", "_id name profilePic");
    
    res.json(sanitizeUser(updatedUser));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const deletedUser = sanitizeUser(req.profile);
    await req.profile.deleteOne();
    res.json({ message: "User deleted successfully", user: deletedUser });
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const deactivateAccount = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.status = 'suspended';
    await user.save();

    res.json({ message: 'Account deactivated successfully' });
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete user's posts, comments, etc. (cascade delete)
    // You might want to add more cleanup here
    await user.deleteOne();

    // Clear session
    res.clearCookie('t');
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.trim().length === 0) {
      return res.json([]);
    }

    const searchRegex = new RegExp(query, 'i');
    
    const users = await User.find({
      $or: [
        { name: searchRegex },
        { email: searchRegex },
        { username: searchRegex },
      ],
    })
      .select('name email username about profilePic followers following')
      .limit(20);

    res.json(users.map(sanitizeUser));
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) });
  }
};

export default {
  create,
  list,
  userByID,
  read,
  update,
  remove,
  photo,
  defaultPhoto,
  addFollowing,
  addFollower,
  removeFollowing,
  removeFollower,
  findPeople,
  deactivateAccount,
  deleteAccount,
  searchUsers,
};
