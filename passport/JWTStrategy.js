const JwtStrategy = require('passport-jwt').Strategy,
	ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports = passport => {
	const opts = {};
	opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
	opts.secretOrKey = process.env.JWT_SECRET;
	opts.passReqToCallback = true;
	passport.use(
		'jwt-strategy',
		new JwtStrategy(opts, async (req, jwt_payload, done) => {
			done(null, jwt_payload.data)
		})
	);
};
