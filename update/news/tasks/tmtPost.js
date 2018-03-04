"use strict";
import axios from "axios";
import moment from "moment";
import ci from "cheerio";
import _ from "lodash";
import BaseTask from "./base";

import stringUtil from "../../../libs/stringUtil";
import { db } from "../database";

var schedule = require('node-schedule');

export default class TmtPost extends BaseTask {
    //构造函数
    constructor(props) {
        super(props)
    }

    processList(url) {
        console.log("url--->", url);
        var _this = this;
        axios({
            url: url
        })
            .then(body => {
                var $1 = ci.load(body.data);
                var sourceKeys = [];
                var catchedData = {};
                $1("div.day_part li[id]").each((idx, item) => {
                    var _key = `${_this.options.className}_${item.attribs["id"]}`;
                    sourceKeys.push(_key);
                    var $item = ci.load(item);
                    catchedData[_key] = {
                        sourceKey: _key,
                        url: $item("h2.w_tit a").attr("href").trim(),
                        title: $item("h2.w_tit a").text().trim(),
                        description: $item("p").text().trim()
                    }
                })
                // console.log("sourceKeys--->", catchedData);
                db.News.findAll({
                    where: {
                        source_key: {
                            $in: sourceKeys
                        }
                    },
                    attributes: [
                        "source_key"
                    ]
                })
                    .then(news => {
                        //         // console.log("dddd----->", sorted.length, news.length, sourceKeys.length);
                        var toSave = [];
                        _.forEach(sourceKeys, element => {
                            var i = 0;
                            for (; i < news.length; i++) {
                                var rawVal = news[i].get({ plain: true });
                                if (element == rawVal.source_key) break;
                            }
                            if (i == news.length) {
                                toSave.push(catchedData[element]);
                            }
                        });

                        return {
                            doNext: news.length == 0,
                            saveData: news.length != sourceKeys.length,
                            data: toSave
                        };
                    })
                    .then(ret => {
                        // console.log("findall--->", ret)
                        if (ret.saveData) {
                            _.forEach(ret.data, (item, idx) => {

                                axios({
                                    url: item.url
                                }).then(detailBody => {
                                    if (detailBody.status !== 200) {
                                        return;
                                    }
                                    var $ = ci.load(detailBody.data);
                                    // var source = _this.getSchemaValue($, "source", _this.options.source);
                                    var time = _this.getSchemaValue($, "span.color-unclickable");
                                    var content = [{ text: _.trimStart(_this.getSchemaValue($, "content"), `【${_this.options.source}】`) }];
                                    var classify = _this.options.classify;
                                    var news_data = {
                                        title: item.title,
                                        description: item.description,
                                        pic_url: "",
                                        source_key: item.sourceKey,
                                        source_url: item.url,
                                        source_name: _this.options.source,
                                        author_name: "",
                                        classify_id: classify,
                                        source_create_date: time,
                                        status: 1
                                    };
                                    // console.log("content--->", content, news_data)
                                    db.sequelize.transaction(t => {
                                        db.NewsDetails.create({
                                            content: JSON.stringify(content),
                                            news: news_data
                                        }, {
                                                include: [{
                                                    association: db.NewsDetails.News
                                                }]
                                            })
                                    })
                                        .then(ret => {
                                            console.log("successful " + item.sourceKey);
                                        })
                                        .catch(err => console.error(err));
                                })
                                    .catch(err => console.error(err));
                            });
                        }
                    })
            })
            .catch(error => {
                console.error(error);
            });
    }
}