"use strict";
import axios from "axios";
import moment from "moment";
import ci from "cheerio";
import _ from "lodash";
import BaseTask from "./base";

import stringUtil from "../../../libs/stringUtil";
import { db } from "../database";

var schedule = require('node-schedule');

export default class Flash36kr extends BaseTask {
    //构造函数
    constructor(props) {
        super(props);
    }

    processList(url) {
        console.log("url--->", url);
        var _this = this;
        axios({
            url: url
        })
            .then(body => {
                var sorted = _.sortBy(body.data.data.items, ["published_at"]);

                var sourceKeys = _.reduce(sorted, (result, item, idx) => {
                    var sourceKey = `${_this.options.className}_${item.id}`;
                    // console.log("sourceKey--->", result, sourceKey)
                    result.push(sourceKey);
                    return result;
                }, []);
                // console.log("sourceKey--->", sourceKeys)
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
                        // console.log("dddd----->", sorted.length, news.length, sourceKeys.length);
                        var toSave = [];
                        _.forEach(sorted, element => {
                            var i = 0;
                            for (; i < news.length; i++) {
                                var rawVal = news[i].get({ plain: true });
                                var key = `${_this.options.className}_${element.id}`;
                                if (key == rawVal.source_key) break;
                            }
                            if (i == news.length) {
                                toSave.push(element);
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
                                var sourceSchema = /。（(.+?)）$/gi;;
                                var group = sourceSchema.exec(item.description);
                                var source = _this.options.source;
                                var source_url = item.news_url;
                                var description = item.description;
                                if (group && group.length > 1) {
                                    var _source = group[1].trim();
                                    if (group[1] && _source !== "全文") {
                                        source = _source;
                                    }
                                    description = item.description.replace(`（${_source}）`, "");
                                }
                                var time = item.published_at;
                                // var pic_url = "";
                                // if (item.image_uris && item.image_uris.length > 0) {
                                //     pic_url = item.image_uris[0];
                                // }
                                var content = [{ text: `${description}` }];
                                var source_key = `${_this.options.className}_${item.id}`;
                                var classify = _this.options.classify;
                                // console.log("content--->", JSON.stringify(content))
                                db.sequelize.transaction(t => {
                                    db.NewsDetails.create({
                                        content: JSON.stringify(content),
                                        news: {
                                            title: "",
                                            description: description,
                                            pic_url: "",
                                            source_key: source_key,
                                            source_url: source_url,
                                            source_name: source,
                                            author_name: "",
                                            classify_id: classify,
                                            source_create_date: time,
                                            status: 1
                                        }
                                    }, {
                                            include: [{
                                                association: db.NewsDetails.News
                                            }]
                                        })
                                })
                                    .then(ret => {
                                        console.log("successful " + item.id);
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