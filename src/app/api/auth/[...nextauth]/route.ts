import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password.");
        }

        await dbConnect();

        const user = await User.findOne({ email: credentials.email }).select("+password");

        if (!user || !user.password) {
          throw new Error("Invalid credentials.");
        }

        const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordMatch) {
          throw new Error("Invalid credentials.");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await dbConnect();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          if (!user.email) {
            throw new Error("No email returned from Google");
          }
          // Create the user in our DB if they don't exist
          await User.create({
            name: user.name || "Google User",
            email: user.email,
            image: user.image || "",
            role: "user",
          });
        }
        return true;
      }
      return true; // allow credentials sign-in
    },
    async jwt({ token, user, account }) {
      // If it's a google sign-in, we need to fetch the MongoDB _id and role
      if (account?.provider === "google") {
        await dbConnect();
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role;
        }
      } else if (user) {
        // For credentials, we already passed these in the authorize callback
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const sessionUser = session.user as { id?: string; role?: unknown };
        sessionUser.id = token.id as string;
        sessionUser.role = token.role;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
