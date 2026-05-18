const express = require('express');
const router = express.Router();
const { getRecommendation, getEmployeeRankings } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// Apply auth protection to all AI routes
router.use(protect);

// @route  POST /api/ai/recommend
router.post('/recommend', getRecommendation);

// @route  GET  /api/ai/rankings
router.get('/rankings', getEmployeeRankings);

module.exports = router;
