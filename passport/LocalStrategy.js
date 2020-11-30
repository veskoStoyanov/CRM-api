const LocalStrategy = require("passport-local").Strategy;
const Auth = require('../core/Auth');
const PipeMan = require('../core/PipeMan');
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
            user = await Auth.create({ email });

            const pipeline = await PipeMan.createPipeline({
              name: INITIAL_PIPELINE_NAME,
              user: user._id
            });

            const pipe = await PipeMan.createPipe({
              title: INITIAL_PIPE_TITLE,
              pipeline: pipeline._id
            });

            pipeline.pipes.push(pipe._id);
            pipeline.save();
          }
        } catch (e) { return done(e, null); }

        return done(null, user);
      }
      )
    );
};
