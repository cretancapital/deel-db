import NextAuth from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "./lib/mongodb-client"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    {
      id: "deel",
      name: "Deel",
      type: "oauth",
      authorization: {
        url: "https://app.deel.com/oauth2/authorize",
        params: { scope: "contracts:read" }
      },
      token: "https://api.deel.com/oauth2/tokens",
      userinfo: "https://api.deel.com/rest/v2/users/me",
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.avatar,
        }
      },
      clientId: process.env.DEEL_CLIENT_ID,
      clientSecret: process.env.DEEL_CLIENT_SECRET,
    }
  ],
  session: {
    strategy: "database",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // @ts-ignore
        session.user.organizationId = (user as any).organizationId;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  }
})
