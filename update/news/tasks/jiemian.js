"use strict";
import axios from "axios";
import moment from "moment";
import ci from "cheerio";
import _ from "lodash";
import BaseTask from "./base";

import stringUtil from "../../../libs/stringUtil";
import { db } from "../database";

var schedule = require('node-schedule');

export default class Jiemian extends BaseTask {
    //构造函数
    constructor(props) {
        super(props)
        this.groups =
            {
                id_36: {
                    name: "天下快讯",
                    classify: "shehui"
                },
                id_48: {
                    name: "商业快讯",
                    classify: "caijing"
                },
                id_85: {
                    name: "中国快讯",
                    classify: "shehui"
                },
                id_116: {
                    name: "股市快讯",
                    classify: "caijing"
                },
                id_165: {
                    name: "消费快讯",
                    classify: "caijing"
                },
                id_166: {
                    name: "金融快讯",
                    classify: "caijing"
                },
                id_167: {
                    name: "工业快讯",
                    classify: "keji"
                },
                id_168: {
                    name: "交通快讯",
                    classify: "社会"
                },
                id_169: {
                    name: "时尚快讯",
                    classify: "shishang"
                },
                id_170: {
                    name: "娱乐快讯",
                    classify: "yule"
                },
                id_177: {
                    name: "宏观快讯",
                    classify: "shehui"
                },
                id_84: {
                    name: "快报",
                    classify: "keji"
                }
            }
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
                $1("div.item-news div.item-main").each((idx, item) => {
                    var $item = ci.load(item);
                    var link = $item("p a").attr("href").trim();
                    var tempKey = stringUtil.between(link, link.lastIndexOf("/") + 1, link.lastIndexOf(".") - 1);
                    var _key = `${_this.options.className}_${tempKey}`;
                    sourceKeys.push(_key);
                    var _title = $item("p a").text().trim();
                    var _desc = $item("p").text().replace(`【${_title}】`, "").trim();
                    // console.log($item("p").html().replace(/<a [^>]+>.+<\/a>/, "").trim())
                    catchedData[_key] = {
                        sourceKey: _key,
                        url: link,
                        title: _title,
                        description: _desc
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
                                    var $ = ci.load(detailBody.data, { decodeEntities: false });
                                    // var source = _this.getSchemaValue($, "source", _this.options.source);
                                    var time = $(`${_this.options.detailSchema} span.date`).html().replace(/<a [^>]+>.+<\/a>/, "").trim();
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