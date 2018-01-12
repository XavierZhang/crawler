require("babel-register");
var path = require('path');
var spawn = require('child_process').spawn;
var config = require('./config');
var marin = require("./update/main").default;
var async = require('async');

marin();

process.on('uncaughtException', function(err) {
  console.error('uncaughtException: %s', err.stack);
})
