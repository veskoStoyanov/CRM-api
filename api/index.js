const { initialize } = require('express-openapi');

const User = require('./User');
const Pipe = require('./Pipe');
const apiHandlers = { ...User, ...Pipe};
const apiSpecFile = require('./openapi.json');

module.exports = app => {
	initialize({
		app,
		apiDoc: apiSpecFile,
		operations: apiHandlers,
	});
	
	return app;
};