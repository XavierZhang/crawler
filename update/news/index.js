import async, { concatSeries } from 'async';
import Debug from 'debug';
import moment from "moment";
var debug = Debug('crawler:news:main');

import config from "./config";
import stringUtil from "../../libs/stringUtil";

module.exports = function () {
    for (var i = 0; i < config.sources.length; i++) {
        var classDynamic = require(`./tasks/${config.sources[i].className}`).default;
        // config.sources[i].url = stringUtil.format(config.sources[i].url, { random: Math.random(), lastTime: moment.unix() });
        var obj = new classDynamic(config.sources[i])
        obj.start();
    }
}
