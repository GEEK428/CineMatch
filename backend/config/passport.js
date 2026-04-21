const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const googleId = profile.id;
      const avatar = profile.photos[0] ? profile.photos[0].value : '';

      // 1. Try to find by Google ID
      let user = await User.findOne({ googleId });

      // 2. If not found by Google ID, try by Email (Link existing accounts)
      if (!user) {
        user = await User.findOne({ email });
        if (user) {
          user.googleId = googleId;
          user.avatar = avatar;
          await user.save();
        } else {
          // 3. Create new user
          user = await User.create({
            googleId,
            email,
            avatar
          });
        }
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));
