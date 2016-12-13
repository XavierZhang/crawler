require("babel-register");
var path = require('path');
var spawn = require('child_process').spawn;
var cronJob = require('cron').CronJob;
var config = require('./config');
var marin = require("./update/main").default;
var async = require('async');

// 定时执行爬虫任务'
var job = new cronJob(config.autoUpdate, function() {
  console.log('开始执行定时爬虫任务');
  marin();
});
marin();
job.start();


process.on('uncaughtException', function(err) {
  console.error('uncaughtException: %s', err.stack);
})
