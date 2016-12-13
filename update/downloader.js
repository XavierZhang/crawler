'use strict'

import request from "request";
import ci from "cheerio";
import _ from "lodash";

/**
 * Created by admin on 1/13/16.
 */

class Downloader {
  constructor(props) {
    this.options = props;
    this.List = [];
  }

  download(callBack) {
    var _this = this
    request({
      uri: _this.options.url,
      method: "GET"
    }, function(error, response, body) {

      if (!error && response.statusCode == 200) {
        var $ = ci.load(body);
        var item = $("ul.center_list_contlist").find("a");
        _.forEach(item, function(link) {
          var url = $(link).attr("href");
          var title = $(link).find("font.cont_tit03").text();

          var dateStr = $(link).find("font.cont_tit02").text();
          var dateArray = dateStr.split("-");
          var date = new Date(dateArray[0], parseInt(dateArray[1]) - 1, dateArray[2]);

          _this.List.push({
            Url: url,
            Title: title,
            CreateDate: date
          });
        });
      }
      callBack(error);
    });

  }
}

export default Downloader;
