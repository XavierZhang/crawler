'use strict'

import request from "request";
import cheerio from 'cheerio';
import Downloader from './downloader';
import _ from "lodash";
import config from '../config';
import tr from 'transliteration';
import stringUtil from "../common/stringUtil"
import Debug from 'debug';
var debug = Debug('crawler:update:division');

class DivisionList extends Downloader {
  // constructor(props) {
  //   super(props);
  // }

  getLatest() {

    if (this.List.length > 0) {
      this.List = _.orderBy(this.List, ["CreateDate"], ["desc"]);
      return _.head(this.List);
    } else {
      return null;
    }
  }

  getDivisionPage(callBack) {
    var latest = this.getLatest();

    var _url = config.urls.division_list + latest.Url.substring(latest.Url.indexOf("/") + 1);
    if (latest != null) {
      request({
        uri: _url,
        method: "GET"
      }, function(error, response, body) {
        callBack(error, body);
      });
    }
  }

  getDivisions(body, callBack) {
    try {
      var $ = cheerio.load(body);
      var items = $("p.MsoNormal");
      var ret = [];
      _.forEach(items, function(item) {
        var result = _.replace($(item).text(), /\s+/g, "");
        if (result != "") {
          var codeReg = /\d+/;
          if (codeReg.test(result)) {
            var code = result.match(codeReg);
            var name = result.substring(code[0].length);

            ret.push({
              Code: code[0],
              Name: name
            });
          }
        }
      });
      callBack(null, ret);
    } catch (e) {
      callBack(e);
    }
  }

  getnerate(arr, callBack) {
    var province = [];
    var only_province = [];
    _.forEach(arr, function(item) {
      if (/^\d{2}0{4}$/.test(item.Code)) {
        province.push({
          Code: item.Code,
          ChineseName: item.Name,
          Pinyin: tr.slugify(item.Name, {
            lowercase: true,
            separator: '-'
          }),
          EnglishName: ""
        });

        only_province.push(item);
      }
    });

    var exclude_province = _.difference(arr, only_province);
    console.log("province---->",only_province);
    var city = [];
    var only_city = [];
    _.forEach(exclude_province, function(item) {
      var sub_Code = stringUtil.last(item.Code, 2);
      if (sub_Code == "00") {
        var pre_Code = stringUtil.first(item.Code, 2);
        var curProvince = _.find(province, function(p) {
          return stringUtil.first(p.Code, 2) == pre_Code;
        });
        city.push({
          Code: item.Code,
          ProviceID: curProvince.Code,
          ChineseName: item.Name,
          Pinyin: tr.slugify(item.Name, {
            lowercase: true,
            separator: '-'
          }),
          EnglishName: ""
        });

        only_city.push(item)
      }
    });
    var exclude_city = _.difference(exclude_province, only_city);
    console.log("city--->",only_city);
    var county = [];
    callBack(null);
  }
}

export default DivisionList;
