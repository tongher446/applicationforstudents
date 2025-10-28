// src/app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/user";
import bcrypt from "bcryptjs";

// ✅ EXPORT authOptions so layout.jsx can use it
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await connectMongoDB(); // Now uses cached connection
          const user = await User.findOne({ email: credentials.email });
          if (!user) return null;
          
          const isMatch = await bcrypt.compare(credentials.password, user.password);
          if (!isMatch) return null;

          return { id: user._id.toString(), email: user.email };
        } catch (error) {
          console.error("Authorize error:", error.message);
          return null; // Never throw — return null for invalid credentials
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET, // ✅ Must be set in Vercel
  pages: {
    signIn: "/welcome",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };