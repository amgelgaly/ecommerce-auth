const express = require('express');
const router = express.Router();
const { 
  createReview, 
  updateReviewStatus, 
  getReviews 
} = require('../controllers/reviewController');
const auth = require('../middleware/auth');

router.post('/', auth(['customer']), createReview);
router.patch('/', auth(['admin']), updateReviewStatus);
router.get('/', auth(['admin']), getReviews);

module.exports = router;