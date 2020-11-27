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
     
		return res.status(200).json({ success: true, user });
	})(req, res, next);
};

const logoutUser = async (req, res) => res.status(200).send('Success');

const updateUser = async (req, res) => {
	const _id = req.params.id;
	const userInfo = req.body;

	let user = await Auth.fetchUser({ _id });

	if (!user) {
		return res.status(400).send({ message: 'Invalid user id' });
	}

	Object.keys(userInfo)
		.forEach(key => {
			user[key] = userInfo[key];
		});

	await user.save();
	user = T.removeProps(userInfo, propsForDeleting);

	return res.status(200).send({ message: 'User has been updated successfuly', userInfo });
};

const getUser = async (req, res) => {
	const _id = req.params.id;
	let userData = await Auth.fetchUser({ _id });
	userData = T.removeProps(userData);

	return res.status(200).send(userData);
};

module.exports = {
	loginUser,
	logoutUser,
	updateUser,
	getUser,
};