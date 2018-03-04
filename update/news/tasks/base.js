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
        var detailSchema = `${this.options.detailSchema} ` || "";
        if (this.options.schema[schema]) {
            val = stringUtil.getValue($(`${detailSchema}${this.options.schema[schema]}`).text()).trim();
        }
        else {
            val = stringUtil.getValue($(`${detailSchema}${schema}`).text()).trim();
        }
        if (stringUtil.isNullOrWhiteSpace(val)) {
            console.log("empty value---->", schema, this.options.schema[schema]);
        }
        return val;
    }
}