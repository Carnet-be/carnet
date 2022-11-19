import NextAuth, { type NextAuthOptions } from "next-auth";
// Prisma adapter for NextAuth, optional and can be removed
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "@env/server.mjs";
import { prisma } from "../../../server/db/client";
import { confirmPasswordHash } from "@utils/bcrypt";
import { PrismaAdapter } from "@next-auth/prisma-adapter";



export const authOptions: NextAuthOptions = {
  // Include user.id on session

  callbacks: {
    async jwt({ token, user }) {
      if(user){
          token.email=user.email
      }
      return token
    },
  },
  // Configure one or more authentication providers
  
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        try {
          const user = await prisma.user.findUniqueOrThrow({
            where: {
              email,
            },
          }); 

          if (user) {
            // Any object returned will be saved in `user` property of the JWT
            const checkPwd = await confirmPasswordHash(
              password || "",
              user.password
            );
            if (checkPwd) {
              return user;
            } else {
              throw new Error("password invalid");
            }
            
          } else {
            // If you return null then an error will be displayed advising the user to check their details.
            throw new Error("User not exist");

            // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
          }
        } catch (error) {
          throw error;
        }
      },
    }),

    // ...add more providers here
  ],
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
  },
};

export default NextAuth(authOptions);
