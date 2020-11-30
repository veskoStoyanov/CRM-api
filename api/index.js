const { initialize } = require('express-openapi');

const User = require('./User');
const Pipeline = require('./Pipeline');
const apiHandlers = { ...User, ...Pipeline};
const apiSpecFile = require('./openapi.json');

module.exports = app => {
	initialize({
		app,
		apiDoc: apiSpecFile,
		operations: apiHandlers,
	});
	
	return app;
};