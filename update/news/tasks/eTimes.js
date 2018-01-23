"use strict";
import axios from "axios";
import moment from "moment";
import ci from "cheerio";
import _ from "lodash";
import BaseTask from "./base";

import stringUtil from "../../../libs/stringUtil";
import { db } from "../database";

var schedule = require('node-schedule');

export default class ETimes extends BaseTask {
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
                var preMoment = moment(moment().subtract(1, "days").format("YYYY-MM-DD"));
                var sorted = _.sortBy(body.data.data, ["timestamp"]);
                var lastItem = _.last(sorted);

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

                                axios({
                                    url: item.url
                                }).then(detailBody => {
                                    if (detailBody.status !== 200) {
                                        return;
                                    }
                                    var $ = ci.load(detailBody.data);
                                    var source = _this.getSchemaValue($, "source", _this.options.source);
                                    // var tags = _this.getSchemaValue($, "tag");

                                    var time = _this.getSchemaValue($, "div.author span.time");
                                    var tempName = _this.getSchemaValue($, "author_name");
                                    var author_name = stringUtil.first(tempName, tempName.indexOf(time));
                                    if (author_name) {
                                        author_name = author_name.trim();
                                    }
                                    if (author_name.indexOf("·") >= 0) {
                                        author_name = stringUtil.first(author_name, author_name.indexOf("·")).trim();
                                    }

                                    var description = _.trimStart(stringUtil.first(_this.getSchemaValue($, "description"), 200), "e公司讯，");
                                    var pic_url = "";
                                    if (item.imgs && item.imgs.length > 0) {
                                        pic_url = item.imgs[0];
                                        pic_url = _this.getSchemaValue($, "pic_url", pic_url);
                                    }
                                    var content = [{ text: _.trimStart(_this.getSchemaValue($, "content"), "e公司讯，") }];
                                    var source_key = `${_this.options.className}_${item.id}`;
                                    var source_url = item.url;
                                    var classify = _this.options.classify;
                                    // console.log("content--->", JSON.stringify(content))
                                    db.sequelize.transaction(t => {
                                        db.NewsDetails.create({
                                            content: JSON.stringify(content),
                                            news: {
                                                title: item.title,
                                                description: description,
                                                pic_url: pic_url,
                                                source_key: source_key,
                                                source_url: source_url,
                                                source_name: stringUtil.after(source, "："),
                                                author_name: author_name,
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