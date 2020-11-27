const LocalStrategy = require("passport-local").Strategy;
const User = require('../models/User');

module.exports = passport => {
  'local-signin',
  passport.use(
    new LocalStrategy({
      usernameField: 'email',
      passwordField: 'email',
    }, async (email, p, done) => {
      let user = null;
      try {
        user = await User.findOne({ email });

        if (!user) {
          user = await User.create({ email })
        }
      } catch (e) {
        return done(e, null);
      }

      return done(null, user);
    }
    )
  );
};
