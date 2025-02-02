const express = require('express');
const { createReview, getReviews, getReviewById, deleteReview } = require('../controllers/reviewController');

const router = express.Router();

router.post('/reviews', createReview);  // Submit a review
router.get('/reviews', getReviews);  // Get all reviews
router.get('/reviews/:id', getReviewById);  // Get a single review
router.delete('/reviews/:id', deleteReview);  // Delete a review

module.exports = router;
