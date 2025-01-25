// import { MongoDBAdapter } from "@auth/mongodb-adapter"
import GitHubProvider from "next-auth/providers/github"
// import clientPromise from "@/server/mongodb"
import NextAuth from "next-auth"
import "next-auth/jwt"

export const { handlers, signIn, signOut, auth } = NextAuth({
  // adapter: MongoDBAdapter(clientPromise, {
  //   collections: {
  //     Users: "users",
  //     Accounts: "accounts",
  //     Sessions: "sessions",
  //     VerificationTokens: "verification_tokens",
  //   },
  //   databaseName: "hemvip",
  // }),
  session: {
    strategy: "jwt",
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          username: profile.login,
          email: profile.email,
          image: profile.avatar_url,
          followers: profile.followers,
          verified: true,
        }
      },
    }),
  ],
  // callbacks: {
  //   async session({ session, user }) {
  //     // Send properties to the client, like an access_token from a provider.
  //     // session.username = user.username
  //     // session.email = user.email
  //     // session.name = user.name

  //     return session
  //   },
  // },
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      if (pathname === "/middleware-example") return !!auth
      return true
    },
    jwt({ token, trigger, session, account }) {
      if (trigger === "update") token.name = session.user.name
      if (account?.provider === "keycloak") {
        return { ...token, accessToken: account.access_token }
      }
      return token
    },
    async session({ session, token }) {
      if (token?.accessToken) session.accessToken = token.accessToken

      return session
    },
  },
  experimental: { enableWebAuthn: true },
})
