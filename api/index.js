const { initialize } = require('express-openapi');

const Entity = require('./Entity');
const User = require('./User');
const Pipeline = require('./Pipeline');
const Field = require('./Field');
const apiHandlers = { ...User, ...Pipeline, ...Field, ...Entity };
const apiSpecFile = require('./openapi.json');

module.exports = app => {
	initialize({
		app,
		apiDoc: apiSpecFile,
		operations: apiHandlers,
	});
	
	return app;
};