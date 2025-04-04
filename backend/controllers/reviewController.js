const Review = require('../models/Review');

exports.createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const review = new Review({
      productId,
      customerId: req.user.id,
      rating,
      comment,
    });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateReviewStatus = async (req, res) => {
  try {
    const { reviewId, status, moderationNote } = req.body;
    const review = await Review.findByIdAndUpdate(
      reviewId,
      { status, moderationNote },
      { new: true }
    );
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const { status } = req.query;
    const reviews = await Review.find(status ? { status } : {})
      .populate('customerId', 'name image')
      .populate('productId', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};