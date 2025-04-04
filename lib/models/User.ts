// lib/models/User.ts
import mongoose, { Schema, Document, models, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { User as UserInterface } from '../db-models'; // Using interface from db-models

export interface UserDocument extends UserInterface, Document {
  _id: mongoose.Types.ObjectId; // Ensure _id is defined
  password?: string; // Password might not always be selected
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema<UserDocument> = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: { type: String, select: false }, // Default: don't select password
    role: {
      type: String,
      enum: ['admin', 'seller', 'customer'],
      default: 'customer',
    },
    // Add other fields from NextAuth User if needed (e.g., emailVerified, image)
    emailVerified: { type: Date, select: false },
    image: { type: String },
    // Fields for commission and earnings system
    balance: { type: Number, default: 0 }, // Current balance for sellers
    totalEarnings: { type: Number, default: 0 }, // Total earnings for sellers
    commissionRate: { type: Number, default: 10, min: 0, max: 100 }, // Commission rate for sellers (percentage)
    bankInfo: {
      bankName: { type: String },
      accountNumber: { type: String },
      accountHolder: { type: String },
      iban: { type: String }
    },
    withdrawalHistory: [{
      amount: { type: Number, required: true },
      status: { type: String, enum: ['pending', 'completed', 'rejected'], default: 'pending' },
      requestDate: { type: Date, default: Date.now },
      completionDate: { type: Date },
      notes: { type: String }
    }]
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true, // Ensure virtuals like 'id' are included
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password; // Ensure password is never sent in JSON
      },
    },
     toObject: { // Also add toObject transformation if needed
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password;
      },
    },
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password') || !this.password) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<UserDocument> =
  models.User || mongoose.model<UserDocument>('User', UserSchema);

export default User;