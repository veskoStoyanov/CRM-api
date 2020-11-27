module.exports = passport => {
	require('./LocalStrategy')(passport);
	require('./JWTStrategy')(passport);
};