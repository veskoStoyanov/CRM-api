const passport = require('passport');
const T = require('../core/Tools');

const loginUser = async (req, res, next) => {
	passport.authenticate('local', { session: false }, async function (err, user) {
		if (err) { return next(err); }

		if (!user) { return res.status(400).json({ errors: [err] }); }
		
		try {
			await T.sendLoginEmail(user);
		} catch (e) {
			return res.status(400).json({ errors: [err] });
		}

		return res.status(200).json({ success: true });
	})(req, res, next);
};

const activateUser = async (req, res, next) => {
	passport.authenticate('jwt-strategy', { session: false }, async (err, user) => {
		if (err) { return next(err); }

		if (!user) { return res.status(400).json({ errors: [err] }); }

		let token = '';
		try {
			token = T.generateToken(user);
		} catch (e) {
			return res.status(400).json({ errors: [err] });
		}

		return res.status(200).json({ success: true, user, token });
	})(req, res, next);
};

const logoutUser = async (req, res) =>{
	passport.authenticate('jwt-strategy', { session: false }, async (err, user) => {
		if (err) { return next(err); }

		if (!user) { return res.status(400).json({ errors: [err] }); }

		return res.status(200).json({ success: true });
	})(req, res, next);
};

const updateUser = async (req, res) => {

};

const getUser = async (req, res) => {

};

module.exports = {
	loginUser,
	activateUser,
	logoutUser,
	updateUser,
	getUser,
};