const { initialize } = require('express-openapi');

const User = require('./User');
const Pipeline = require('./Pipeline');
const List = require('./List');
const apiHandlers = { ...User, ...Pipeline, ...List };
const apiSpecFile = require('./openapi.json');

module.exports = app => {
	initialize({
		app,
		apiDoc: apiSpecFile,
		operations: apiHandlers,
	});
	
	return app;
};