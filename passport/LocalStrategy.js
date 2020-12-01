const LocalStrategy = require("passport-local").Strategy;
const Auth = require('../core/Auth');

module.exports = passport => {
  'local-signin',
    passport.use(
      new LocalStrategy({
        usernameField: 'email',
        passwordField: 'email',
      }, async (email, p, done) => {
        let user = null;
        try {
          user = await Auth.getByEmail({ email });
          if (!user) { 
            user = await Auth.create({ email });
          }
        } catch (e) { return done(e, null); }

        return done(null, user);
      }
      )
    );
};
