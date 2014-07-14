var express = require('express');
var app = express();
var config = require('./app/config/express.js');
config(app, express);
module.exports = app;