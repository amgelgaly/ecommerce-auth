// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"; // مثال
import clientPromise from "@/lib/mongodbClientPromise";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"; // Optional: for database sessions

export const authOptions: NextAuthOptions = {
  // Optional: Use MongoDB Adapter for database sessions
  // adapter: MongoDBAdapter(clientPromise),
  providers: [
    // GoogleProvider({ // Example
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        console.log("Credentials:", credentials);
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing email or password");
          throw new Error("Please provide email and password");
        }

        const client = await clientPromise;
        const db = client.db();

        const user = await User.findOne({ email: credentials.email }).select('+password'); // Include password for comparison
        console.log("User found:", user);
        if (!user || !user?.password) {
          throw new Error("Invalid credentials");
        }

        const isPasswordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordMatch) {
          throw new Error("Invalid credentials");
        }

        // Return user object without password
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt", // Use JWT for sessions (simpler without adapter)
    // strategy: "database", // Use database sessions if using adapter
    // maxAge: 30 * 24 * 60 * 60, // 30 days (if using database sessions)
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add role and id to the JWT token
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Add role and id to the session object
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login", // Redirect users to custom login page
    // error: '/auth/error', // Custom error page
    // newUser: '/auth/register' // Optional: Redirect new users
  },
  secret: process.env.NEXTAUTH_SECRET,
  // debug: process.env.NODE_ENV === 'development', // Enable debug logs in development
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };