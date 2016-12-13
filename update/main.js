import async from 'async';
import config from '../config';
import DivisionList from './divisionList';
import Debug from 'debug';
var debug = Debug('crawler:update:main');

export default function() {
  var divisionList = new DivisionList({
    url: config.urls.division_list
  });

  async.waterfall([
    // function(callBack) {
    //   divisionList.download(callBack);
    // },
    // function(callBack) {
    //   divisionList.getDivisionPage(callBack);
    // },
    // function(body, callBack) {
    //   divisionList.getDivisions(body, callBack);
    // }
    divisionList.download.bind(divisionList),
    divisionList.getDivisionPage.bind(divisionList),
    divisionList.getDivisions.bind(divisionList),
    divisionList.getnerate.bind(divisionList)
  ], function(err, results) {
    if (err) console.error(err.stack);

    console.log('完成', results);
  });
}
