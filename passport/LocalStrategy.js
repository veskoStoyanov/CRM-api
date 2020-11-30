const LocalStrategy = require("passport-local").Strategy;
const Auth = require('../core/Auth');
const PM = require('../core/PipeMan');
const INITIAL_PIPE_TITLE = 'New Leads';
const INITIAL_PIPELINE_NAME = 'main';

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
            const pipe = await PM.createPipe({ title: INITIAL_PIPE_TITLE });
            const pipeline = await PM.createPipeline({ name: INITIAL_PIPELINE_NAME, pipes: [ pipe._id ]});

            user = await Auth.create({ email, pipelines: [ pipeline._id ] });
          }
        } catch (e) { return done(e, null); }

        return done(null, user);
      }
      )
    );
};
