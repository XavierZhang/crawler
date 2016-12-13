// MySQL数据库连接配置
var mysql = require('mysql');
exports.db = mysql.createConnection({
  host: '127.0.0.1', // 数据库地址
  port: 3306, // 数据库端口
  database: 'iCar', // 数据库名称
  user: 'root', // 数据库用户
  password: 'Welin_local' // 数据库用户对应的密码
});

// 抓取地址配置
exports.urls = {
  division_list: 'http://www.stats.gov.cn/tjsj/tjbz/xzqhdm/' // 行政区域更新列表配置
};

// Web服务器端口
exports.port = 3000;

// 定时更新
//cron expressions: "Seconds Minutes Hours Day-of-Month Month Day-of-Week Year(optional)"
exports.autoUpdate = '* * * * * *'; // 每天凌晨1点执行一次，任务执行规则，参考 cron 语法
