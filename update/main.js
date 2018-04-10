import Debug from 'debug';
import fs from "fs";
import moment from "moment";
var debug = Debug('crawler:main');
const dir = "./update/";

export default function () {
  // console.log("date-->",moment.unix(1515504307).format("YYYY-MM-DD HH:mm:ss"))
  // var sourceSchema = new RegExp("((https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])\" rel=\"nofollow\">一财</a>）", "ig");
  // console.log("match--->", sourceSchema.exec("投面直接堵上了当前业人才工作的<a href=\"http://www.csrc.gov.cn/pub/newsite/zjhxwfb/xwdd/201801/t20180111_332392.html\" rel=\"nofollow\">意见</a>》。《意见》旨在进\n中国央行答复有关人民币逆周期系数调整的问题称，人民币中间价报价行根据多因素决定是否调整逆周期系数。（全文）一步很多资管产品非标投资的重要渠道。（<a href=\"http://www.yicai.com/news/5391100.html\" rel=\"nofollow\">一财</a>）</p>\n"));
  // var sourceSchema = /。（(.+?)）\n?$/ig;
  // console.log("match--->", sourceSchema.exec("中国央行答复有关人民币逆周期局（ATO）正系数调整的问题称，人民币中间价报价行根据多因素决定是否调整逆周期系数。（全文）\n"));
  // var text = `ss【两市平开】
  // 沪指开盘报3504.34点，涨0.09%。
  // 深成指开盘报11514.56点，涨0.01%。
  // asdf【af收费科技】s违反dfwer
  // 创业板开盘报1767.33点，跌0.05%。`;
  // var sourceSchema = /^【(.+?)】/gm;
  // var group = sourceSchema.exec(text);
  // console.log("match--->", group, text.replace(group[0], ""));
  // var _desc = "中国央行答复有关人民币逆周期局（ATO）正系数调整的问题称《？(?)";
  // var _group = /[^。，；：《》？?、‘’）（\(\)【】\{\}\[\]<\+=>！“”]+([。，；：《》？?、‘’）（\(\)【】\{\}\[\]<\+=>！“”]+)$/.exec(_desc);
  // if (_group && _group.length > 1) {
  //   console.log("true--->", `${_desc.substr(0, _desc.length - _group[1].length)}……`);
  // }
  // else {
  //   console.log("false---->", `${_desc}……`);
  // }
  // return;
  var fileList = fs.readdirSync(dir, 'utf-8');
  // var jobs = [];
  for (var i = 0; i < fileList.length; i++) {
    var stat = fs.lstatSync(dir + fileList[i]);
    // 是目录，需要继续
    if (stat.isDirectory()) {
      var job = require("./" + fileList[i]);
      // var config = require(`./${fileList[i]}/config`);
      // var rule = config.autoUpdate;
      console.log("init--->", fileList[i], i);
      // 定时执行爬虫任务'
      // jobs.push(schedule.scheduleJob(rule, function () {
      //   console.log(`${moment().format()}\t开始执行定时爬虫任务${config.jobName ? config.jobName : ""}`, rule);
      //   job(this);
      // }));
      job();
    }
  }

  console.log("going to start jobs---->");
  // for (var i; i < jobs.length; i++) {
  //   console.log("start job", i, jobs[i].name);
  //   jobs[i].invoke();
  // }
}
