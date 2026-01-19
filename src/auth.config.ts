import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUserById, getUserByEmail } from "./app/actions/data";
import bcrypt from "bcryptjs";
import { RoleType } from "@prisma/client";
import { NextResponse } from "next/server";
import { Enrollment } from "@prisma/client";



export default {
    providers: [Google, Credentials({
        async authorize(credentials) {
            if (!credentials) return null;
            const email = credentials.email as string;
            const password = credentials.password as string;
            if (!email || !password) return null;
            const user = await getUserByEmail(email.toLowerCase());
            if (!user || !user.password) return null;
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                return user;
            }
            return null;
        },
    })],
   
    callbacks: {
        async signIn({ user }) {
            const getExistingUser = await getUserById(user.id);
            if (!getExistingUser) {
                return false;
            }
            return true;
        },
        authorized: async ({ auth }) => {
            // Logged in users are authenticated, otherwise redirect to login page
            //console.log(auth);
            return !!auth;
        },
      async jwt({ token, user }) {
    if (!token.sub) return token;
    const existingUser = await getUserById(token.sub);
    if (!existingUser) {
        return token;
    }
    token.ph_no = existingUser.ph_no;
    token.role = existingUser.role;
    token.image = existingUser.image;
    token.enrollments = existingUser.enrollments || [];
    return token;
},
async session({ session, token }) {
    if (token.sub && session.user) {
        session.user.id = token.sub;
    }
    if (token.ph_no && session.user) {
        session.user.ph_no = token.ph_no as number;
    }
    if (token.role && session.user) {
        session.user.role = token.role as RoleType
    }
    if (token.image && session.user) {
        session.user.image = token.image as string;
    }
    if (token.enrollments && session.user) {
        session.user.enrollments = token.enrollments as Enrollment[];
    }
    return session;
},
    },
} satisfies NextAuthConfig;
