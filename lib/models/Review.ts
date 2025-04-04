// lib/models/Review.ts
import mongoose, { Schema, Document, models, Model } from 'mongoose';
import { Review as ReviewInterface } from '../db-models';

export interface ReviewDocument extends ReviewInterface, Document {
   _id: mongoose.Types.ObjectId;
   status: 'pending' | 'approved' | 'rejected';
   moderationNote?: string;
}

const ReviewSchema: Schema<ReviewDocument> = new Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true
    },
    moderationNote: { 
      type: String,
      trim: true 
    }
  },
  {
    timestamps: true,
     toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
     toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// Add compound unique index for [productId, customerId]
ReviewSchema.index({ productId: 1, customerId: 1 }, { unique: true });

// Middleware to update product rating and review count
ReviewSchema.post('save', async function() {
  const Product = mongoose.model('Product');
  const stats = await mongoose.model('Review').aggregate([
    { $match: { productId: this.productId } },
    { 
      $group: {
        _id: '$productId',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  await Product.findByIdAndUpdate(this.productId, {
    averageRating: stats[0]?.averageRating || 0,
    reviewCount: stats[0]?.reviewCount || 0
  });
});

ReviewSchema.post('remove', async function() {
  const Product = mongoose.model('Product');
  const stats = await mongoose.model('Review').aggregate([
    { $match: { productId: this.productId } },
    { 
      $group: {
        _id: '$productId',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  await Product.findByIdAndUpdate(this.productId, {
    averageRating: stats[0]?.averageRating || 0,
    reviewCount: stats[0]?.reviewCount || 0
  });
});

const Review: Model<ReviewDocument> =
  models.Review || mongoose.model<ReviewDocument>('Review', ReviewSchema);

export default Review;