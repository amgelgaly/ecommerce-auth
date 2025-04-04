// lib/models/Category.ts
import mongoose, { Schema, Document, models, Model } from 'mongoose';
import { Category as CategoryInterface } from '../db-models';

export interface CategoryDocument extends CategoryInterface, Document {
   _id: mongoose.Types.ObjectId;
}

const CategorySchema: Schema<CategoryDocument> = new Schema(
  {
    name: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    image: { type: String },
    // Add parent category for subcategories if needed
    // parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
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

const Category: Model<CategoryDocument> =
  models.Category || mongoose.model<CategoryDocument>('Category', CategorySchema);

export default Category;