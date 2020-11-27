const passport = require('passport');
const T = require('../core/Tools');

const loginUser = async (req, res, next) => {
	passport.authenticate('local', { session: false }, async function (err, user) {
		if (err) return next(err);

		if (!user) {
			return res.status(400).json({ errors: [err] });
		}
        		
		try {
			 await T.sendLoginEmail(user.email);
        } catch (e) {
            return res.status(400).json({ errors: [err] });
        }
     
		return res.status(200).json({ success: true});
	})(req, res, next);
};

const activateUser = async (req, res, next) => {
	passport.authenticate('jwt-strategy', { session: false }, async (err, user) => {
		if (err) return next(err);

		if (!user) {
			return res.status(400).json({ errors: [err] });
		}
        
		const token = T.generateToken(user.email);
 
		return res.status(200).json({ success: true, user,  token});
	})(req, res, next);
};

const logoutUser = async (req, res) => res.status(200).send('Success');

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