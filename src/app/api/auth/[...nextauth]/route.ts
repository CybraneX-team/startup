// /app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.googleClientId!,
      clientSecret: process.env.googleClientScret!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",   // Custom sign-in page
    error: "/auth/signin",    // Redirect error back to sign-in
  },
  callbacks: {
    async signIn({ user }) {
      // optional logging
      return true;
    },
    async jwt({ token, user, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
    (session as any).accessToken = token.accessToken;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // After successful Google OAuth, redirect to home page
      // A global sync handler will handle the backend sync
      if (url === `${baseUrl}/auth/signin` || url === `${baseUrl}/api/auth/signin` || url.startsWith(`${baseUrl}/api/auth/callback`)) {
        return `${baseUrl}/`;
      }
      // Allow relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allow callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };