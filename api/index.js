const { initialize } = require('express-openapi');

const User = require('./User');
const Pipeline = require('./Pipeline');
const List = require('./List');
const Contact = require('./Contact');
const Core = require('./Core');
const apiHandlers = { ...User, ...Pipeline, ...List, ...Contact, ...Core };
const apiSpecFile = require('./openapi.json');

module.exports = app => {
	initialize({
		app,
		apiDoc: apiSpecFile,
		operations: apiHandlers,
	});
	
	return app;
};