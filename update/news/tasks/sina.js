"use strict";
import axios from "axios";
import moment from "moment";
import ci from "cheerio";
import _ from "lodash";
import BaseTask from "./base";

import stringUtil from "../../../libs/stringUtil";
import { db } from "../database";

var schedule = require('node-schedule');

export default class Sina extends BaseTask {
    //构造函数
    constructor(props) {
        super(props)
        this.groups =
            {
                id_90: {
                    name: "国内",
                    classify: "guonei"
                },
                id_91: {
                    name: "国际",
                    classify: "guoji"
                },
                id_92: {
                    name: "社会",
                    classify: "shehui"
                },
                id_94: {
                    name: "体育",
                    classify: "tiyu"
                },
                id_95: {
                    name: "娱乐",
                    classify: "yule"
                },
                id_93: {
                    name: "军事",
                    classify: "junshi"
                },
                id_96: {
                    name: "科技",
                    classify: "keji"
                },
                id_97: {
                    name: "财经",
                    classify: "caijing"
                },
                id_98: {
                    name: "股市",
                    classify: "gushi"
                },
                id_99: {
                    name: "股市",
                    classify: "gushi"
                }
            }
    }

    processList(url) {
        console.log("url--->", url, this.options.extractor);
        var _this = this;
        axios({
            url: url
        })
            .then(body => {
                var f = new Function(`${body.data}\n return jsonData`);

                var sourceKeys = [];
                var catchedData = {};

                var _data = f();
                if (_data.list && _data.list.length > 0) {
                    _.each(_data.list, item => {
                        var _key = stringUtil.between(item.url, item.url.lastIndexOf("/") + 1, item.url.lastIndexOf(".") - 1);
                        sourceKeys.push(_key);
                        catchedData[_key] = {
                            sourceKey: _key,
                            url: item.url,
                            title: item.title,
                            classify: _this.groups[`id_${item.channel.id}`].classify,
                            time: moment.unix(item.time).format("YYYY-MM-DD HH:mm:ss")
                        }
                    });

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
                            // console.log("dddd----->", news.length, sourceKeys.length);
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
                                function _run() {
                                    function saveNews(news_data, sc) {
                                        // console.log("source---->", news_data, sc.data.message.title);
                                        var content = "";
                                        if (sc.data && sc.data.message && sc.data.message.text) {
                                            content = [{ text: `${sc.data.message.text}` }];
                                        }
                                        news_data.description = `${stringUtil.first(sc.data.message.text.replace(/[^。]\n[^。]/g, "。").replace(/\n/g, ""), 200)}……`;
                                        news_data.title = sc.data.message.title;
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
                                                console.log("successful---->", ret);
                                            })
                                            .catch(err => console.error(err));
                                    }
                                    return ret.data.reduce((promise, item) => {
                                        // console.log("item--->", promise, item);
                                        return promise.then(() => axios({
                                            url: `${_this.options.extractor}/extract?url=${item.url}`
                                        })).then((sc) => {
                                            var news_data = {
                                                title: item.title,
                                                description: "",
                                                pic_url: "",
                                                source_key: item.sourceKey,
                                                source_url: item.url,
                                                source_name: _this.options.source,
                                                author_name: "",
                                                classify_id: item.classify,
                                                source_create_date: item.time,
                                                status: 1
                                            };
                                            return saveNews(news_data, sc);
                                        })
                                    }, Promise.resolve());
                                }
                                _run();
                            }
                        })
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
}