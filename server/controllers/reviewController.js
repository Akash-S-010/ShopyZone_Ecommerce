import Product from "../models/Product.js";

// ---------------- Add Review ----------------
export const addReview = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    if (!rating) {
      return res.status(400).json({ message: "Rating is required" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }

    // Add new review
    const review = {
      user: req.user._id,
      rating: Number(rating),
      comment,
    };
    product.reviews.push(review);

    // Update average rating
    product.averageRating =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added successfully", reviews: product.reviews });
  } catch (err) {
    next(err);
  }
};

// ---------------- Get Reviews ----------------
export const getReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId)
      .populate("reviews.user", "name email avatar");

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product.reviews);
  } catch (err) {
    next(err);
  }
};

// ---------------- Delete Review ----------------
export const deleteReview = async (req, res, next) => {
  try {
    const { productId, reviewId } = req.params;
    const product = await Product.findById(productId);

    if (!product) return res.status(404).json({ message: "Product not found" });

    const review = product.reviews.find((r) => r._id.toString() === reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Only review owner or admin can delete
    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    product.reviews = product.reviews.filter((r) => r._id.toString() !== reviewId);

    // Recalculate average rating
    if (product.reviews.length > 0) {
      product.averageRating =
        product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
    } else {
      product.averageRating = 0;
    }

    await product.save();
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    next(err);
  }
};
