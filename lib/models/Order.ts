// lib/models/Order.ts
import mongoose, { Schema, Document, models, Model } from 'mongoose';
import { Order as OrderInterface, OrderItem } from '../db-models';

export interface OrderDocument extends OrderInterface, Document {
   _id: mongoose.Types.ObjectId;
}

const OrderItemSchema = new Schema<OrderItem>(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }, // Price at the time of order
    // Add name and image snapshot if needed for order history display
    name: { type: String },
    image: { type: String },
  },
  { _id: false } // Don't create separate IDs for order items
);

const OrderSchema: Schema<OrderDocument> = new Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    products: [OrderItemSchema],
    status: {
      type: String,
      enum: ['processing', 'shipped', 'delivered', 'cancelled'], // Added cancelled
      default: 'processing',
      index: true
    },
    totalPrice: { type: Number, required: true },
    platformEarnings: { type: Number, default: 0 }, // Platform's earnings from this order
    sellerEarnings: { type: Number, default: 0 }, // Seller's earnings from this order
    commissionRate: { type: Number, required: true }, // Commission rate at the time of order
    // Add shipping address, payment details etc.
    shippingAddress: {
      street: String,
      city: String,
      postalCode: String,
      country: String,
    },
    paymentResult: { // Example structure
       id: String,
       status: String,
       update_time: String,
       email_address: String,
    },
    estimatedDelivery: { type: Date },
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

// Add compound index for products.productId
OrderSchema.index({ 'products.productId': 1 });

const Order: Model<OrderDocument> =
  models.Order || mongoose.model<OrderDocument>('Order', OrderSchema);

export default Order;