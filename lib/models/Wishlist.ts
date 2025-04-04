// lib/models/Wishlist.ts
import mongoose, { Schema, Document, models, Model, ObjectId } from 'mongoose';

export interface WishlistDocument extends Document {
  _id: ObjectId;
  userId: ObjectId;
  products: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const WishlistSchema: Schema<WishlistDocument> = new Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      index: true 
    },
    products: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product' 
    }]
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

// Create a compound index for faster queries
WishlistSchema.index({ userId: 1, 'products': 1 });

const Wishlist = models.Wishlist || mongoose.model<WishlistDocument>('Wishlist', WishlistSchema);
export default Wishlist;