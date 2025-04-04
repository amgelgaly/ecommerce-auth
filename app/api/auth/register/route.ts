// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectToDB from '../../../lib/mongodb';
import User from '../../../lib/models/User';
import { z } from 'zod';

// Define validation schema
const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(['customer', 'seller']).optional().default('customer'), // Allow specifying role
});

export async function POST(request: NextRequest) {
    try {
        await connectToDB();

        const body = await request.json();

        // Validate input
        const validation = registerSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ message: "Validation failed", errors: validation.error.errors }, { status: 400 });
        }

        const { name, email, password, role } = validation.data;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 409 }); // Conflict
        }

        // Create new user (password will be hashed by pre-save hook in model)
        const newUser = new User({
            name,
            email,
            password,
            role,
        });

        await newUser.save();

        // Don't send password back
        const userResponse = newUser.toJSON(); // Use toJSON to strip password

        return NextResponse.json({ message: 'User registered successfully', user: userResponse }, { status: 201 });

    } catch (error: any) {
        console.error('Registration error:', error);
         // Handle potential duplicate key error during save (though check above should catch most)
        if (error.code === 11000) {
             return NextResponse.json({ message: 'Email already in use' }, { status: 409 });
        }
        return NextResponse.json({ message: 'An error occurred during registration', error: error.message }, { status: 500 });
    }
}