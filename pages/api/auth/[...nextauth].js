import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../lib/prisma";
import bcrypt from "bcryptjs";

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validasi input
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password wajib diisi");
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            throw new Error("Email atau password salah");
          }

          // Verifikasi password
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordValid) {
            throw new Error("Email atau password salah");
          }

          // Return objek user dengan informasi yang dibutuhkan (termasuk role)
          return {
            id: user.id,
            email: user.email,
            role: user.role,
          };
        } catch {
          // Tidak menggunakan variabel error di sini
          throw new Error("Terjadi kesalahan saat login");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role; // Menyimpan role dalam token
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.role = token.role; // Pastikan role tersedia di session
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Pastikan variabel ini ada di .env.local
  session: {
    strategy: "jwt", // Menggunakan JWT untuk session
  },
  pages: {
    signIn: "/auth/login", // Redirect jika gagal login (opsional)
  },
});
