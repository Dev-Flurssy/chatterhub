import express from 'express';
import { requireAuth, isAdmin } from '../controllers/auth.controller.js';
import analyticsCtrl from '../controllers/analytics.controller.js';

const router = express.Router();

// All analytics routes require admin authentication
router.use(requireAuth, isAdmin);

// Analytics endpoints
router.get('/overview', analyticsCtrl.getOverview);
router.get('/signups', analyticsCtrl.getSignups);
router.get('/activity', analyticsCtrl.getActivity);
router.get('/sessions', analyticsCtrl.getSessions);

export default router;
