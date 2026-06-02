import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "./database.js";
import { env } from "./env.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("Google account email is required"), undefined);
        }

        const user = await prisma.user.upsert({
          where: { email },
          update: {
            googleId: profile.id,
            name: profile.displayName || "Bukhari Perfumes User",
            avatar: profile.photos?.[0]?.value ?? null,
            isVerified: true
          },
          create: {
            email,
            googleId: profile.id,
            name: profile.displayName || "Bukhari Perfumes User",
            avatar: profile.photos?.[0]?.value ?? null,
            isVerified: true
          }
        });

        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

export default passport;
