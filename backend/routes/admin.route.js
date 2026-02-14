import express from "express";
import { requireAuth, isAdmin } from "../controllers/auth.controller.js";
import adminCtrl from "../controllers/admin.controller.js";

const router = express.Router();

// All routes require admin authentication
router.use(requireAuth);
router.use(isAdmin);

// System stats
router.get("/system/stats", adminCtrl.getSystemStats);

// User management
router.get("/users", adminCtrl.getAllUsers);
router.post("/users/:userId/deactivate", adminCtrl.deactivateUser);
router.post("/users/:userId/activate", adminCtrl.activateUser);
router.delete("/users/:userId", adminCtrl.deleteUser);

export default router;
