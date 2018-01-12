'use strict'

import axios from "axios";
import cheerio from 'cheerio';
import Downloader from './downloader';
import _ from "lodash";
import config from '../../config';
import { transliterate as tr, slugify } from 'transliteration';
import stringUtil from "../../common/stringUtil"
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

    if (latest != null) {
      var _url = config.urls.division_list + latest.Url.substring(latest.Url.indexOf("/") + 1);

      axios({
        url: _url
      }).then(body => {
        callBack(null, body.data)
      })
        .catch(err => callBack(err, null));
    }
  }

  getDivisions(body, callBack) {
    try {
      var $ = cheerio.load(body);
      var items = $("p.MsoNormal");
      // console.log("ddd-->", items.length);
      var ret = [];
      _.forEach(items, function (item) {
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
      // console.log("result-->", ret);
      callBack(null, ret);
    } catch (e) {
      // console.log("error--->", e)
      callBack(e);
    }
  }

  getnerate(arr, callBack) {
    // console.log("generat---->", slugify)
    var only_province = [];
    _.forEach(arr, function (item) {
      if (/^[0-9]{2}0{4}$/.test(item.Code)) {
        only_province.push({
          Code: item.Code,
          ChineseName: item.Name,
          Pinyin: slugify(item.Name, {
            lowercase: true,
            separator: '-'
          }),
          EnglishName: ""
        });
      }
    });

    var exclude_province = _.difference(arr, only_province);
    // console.log("province---->", exclude_province);
    var only_city = [];
    var county = []
    _.forEach(exclude_province, function (item) {
      var sub_Code = stringUtil.last(item.Code, 2);
      if (sub_Code == "00") {
        var pre_Code = stringUtil.first(item.Code, 2);
        var curProvince = _.find(only_province, function (p) {
          return stringUtil.first(p.Code, 2) == pre_Code;
        });
        // console.log("curProvince---->",item, pre_Code, curProvince)
        only_city.push({
          Code: item.Code,
          ProviceID: curProvince.Code,
          ChineseName: item.Name,
          Pinyin: slugify(item.Name, {
            lowercase: true,
            separator: '-'
          }),
          EnglishName: ""
        });

        var pre_cty_Code = stringUtil.first(item.Code, 4);
        _.forEach(exclude_province, cty => {
          var cur_cty_code = stringUtil.first(cty.Code, 4);
          if (pre_cty_Code == cur_cty_code && cty.Code != item.Code) {
            county.push({
              Code: cty.Code,
              ProviceID: curProvince.Code,
              CityID: item.Code,
              ChineseName: cty.Name,
              Pinyin: slugify(cty.Name, {
                lowercase: true,
                separator: '-'
              }),
              EnglishName: ""
            });
          }
        });
      }
    });
    // var county = _.difference(exclude_province, only_city);
    console.log("county--->", county);
    callBack(null);
  }
}

export default DivisionList;
