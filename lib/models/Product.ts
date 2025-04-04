// lib/models/Product.ts
import mongoose, { Schema, Document, models, Model, ObjectId } from 'mongoose';
import { Product as ProductInterface } from '../db-models';

export interface ProductDocument extends ProductInterface, Document {
  _id: ObjectId;
}

const ProductSchema: Schema<ProductDocument> = new Schema(
  {
    name: { type: String, required: true, trim: true, text: true },
    description: { type: String, trim: true, text: true },
    images: [{ type: String }], // Array of image URLs
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    categoryName: { type: String }, // Denormalized field for better performance
    price: { type: Number, required: true, min: 0, index: true },
    discountPercentage: { type: Number, default: 0, min: 0, max: 100 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    stock: { type: Number, required: true, min: 0 },
    brand: { type: String, index: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    originalPrice: { type: Number, required: true }, // Original price set by seller
    platformFee: { type: Number, default: 0 }, // Platform fee amount
    sellerEarnings: { type: Number, default: 0 }, // Seller's earnings after commission
    status: {
      type: String,
      enum: ['draft', 'pending', 'approved', 'rejected'],
      default: 'draft',
      index: true
    },
    // Add other fields as needed (e.g., specifications, reviews)
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = doc._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = doc._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const Product: Model<ProductDocument> =
  models.Product || mongoose.model<ProductDocument>('Product', ProductSchema);

export default Product;