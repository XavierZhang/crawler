import async from 'async';
import config from './config';
import DivisionList from './divisionList';
import moment from "moment";
import Debug from 'debug';
var schedule = require('node-schedule');
var debug = Debug('crawler:district:main');

module.exports = function () {
    // var job = schedule.scheduleJob(config.autoUpdate, function () {
    //     console.log(`${moment().format()}\t开始执行定时爬虫任务${config.jobName ? config.jobName : ""}`, config.autoUpdate);
    //     var divisionList = new DivisionList({
    //         url: config.urls.division_list
    //     });

    //     async.waterfall([
    //         divisionList.download.bind(divisionList),
    //         divisionList.getDivisionPage.bind(divisionList),
    //         divisionList.getDivisions.bind(divisionList),
    //         divisionList.getnerate.bind(divisionList)
    //     ], function (err, results) {
    //         if (err) console.error(err.stack);

    //         console.log('完成', results);
    //     });
    // });
    // job.invoke();
}
