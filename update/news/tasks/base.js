"use strict";
import moment from "moment";

import stringUtil from "../../../libs/stringUtil";

var schedule = require('node-schedule');

export default class BaseTask {
    //构造函数
    constructor(props) {
        var _options = props || {};
        this.options = _options;
        var _this = this;
        this.job = schedule.scheduleJob(_options.autoUpdate, function () {
            console.log(`${moment().format()}\t开始执行定时爬虫任务${_options.jobName ? _options.jobName : ""}`, _options.autoUpdate);
            _this.processList(stringUtil.format(_this.options.url, { timestamp: "" }));
        });
    }

    start() {
        this.job.invoke();
    }

    getSchemaValue($, schema, defaultValue) {
        var val = defaultValue || "";
        if (this.options.schema[schema]) {
            val = stringUtil.getValue($("div.article-detail " + this.options.schema[schema]).text()).trim();
        }
        else {
            val = stringUtil.getValue($("div.article-detail " + schema).text()).trim();
        }
        return val;
    }
}