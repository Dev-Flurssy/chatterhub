import express from "express";
import multer from "multer";
import path from "path";
import { requireAuth, isAdmin } from "../controllers/auth.controller.js";
import userCtrl from "../controllers/user.controller.js";

const router = express.Router();

// Setup multer for profile photo uploads
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
  // Accept images only for profile photos
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed for profile photos!'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit for profile photos
  }
});

router.put("/follow", requireAuth, userCtrl.addFollowing, userCtrl.addFollower);
router.put(
  "/unfollow",
  requireAuth,
  userCtrl.removeFollowing,
  userCtrl.removeFollower
);

router.get("/findpeople/:userId", requireAuth, userCtrl.findPeople);

// Account management
router.post("/deactivate", requireAuth, userCtrl.deactivateAccount);
router.delete("/delete-account", requireAuth, userCtrl.deleteAccount);

// Search
router.get("/search", requireAuth, userCtrl.searchUsers);

router
  .route("/")
  .get(requireAuth, userCtrl.list)
  .post(requireAuth, isAdmin, userCtrl.create);

router.get("/defaultphoto", userCtrl.defaultPhoto);
router.get("/photo/:userId", userCtrl.photo);

router
  .route("/:userId")
  .get(requireAuth, userCtrl.read)
  .put(requireAuth, upload.single("photo"), userCtrl.update)
  .delete(requireAuth, userCtrl.remove);

router.param("userId", userCtrl.userByID);

export default router;
