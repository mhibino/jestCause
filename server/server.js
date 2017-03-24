
var express = require('express');
var app = express();
var db = require('./config/config.js');
var port = process.env.PORT || 8000;

require('./config/middleware.js')(app,express);
require('./config/routes.js')(app, express);

app.listen(port, function() {
	console.log('listening on port ', port);
});

module.exports = app;