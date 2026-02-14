import express from "express";
import multer from "multer";
import path from "path";
import { requireAuth } from "../controllers/auth.controller.js";
import postCtrl from "../controllers/post.controller.js";

const router = express.Router();

// Setup multer for file uploads (photos and videos)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images and videos
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed!'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// PARAM middleware
router.param("postId", postCtrl.postByID);
router.param("userId", postCtrl.userByID);

// POST routes - accept either 'photo' or 'video' field
router.post("/new", requireAuth, upload.any(), postCtrl.create);

// GET routes
router.get("/", requireAuth, postCtrl.list); // list user-specific posts (if used)
router.get("/feed/:userId", requireAuth, postCtrl.listNewsFeed); // personalized feed
router.get("/all", postCtrl.listAll); // ✅ global feed route (no double prefix)
router.get("/by/:userId", requireAuth, postCtrl.postsByUser);
router.get("/photo/:postId", postCtrl.photo);
router.get("/search", requireAuth, postCtrl.searchPosts); // search posts

// PUT routes
router.put("/like", requireAuth, postCtrl.like);
router.put("/unlike", requireAuth, postCtrl.unlike);
router.put("/comment", requireAuth, postCtrl.comment);
router.put("/uncomment", requireAuth, postCtrl.uncomment);

// DELETE & READ routes
router
  .route("/:postId")
  .get(requireAuth, postCtrl.read)
  .delete(requireAuth, postCtrl.isPoster, postCtrl.remove);

export default router;
