exports.sources =
    [
        // {
        //     url: `http://www.egsea.com/index.php?app=Company&mod=Index&act=flash&ajax=true&pageLastTimeStamp={timestamp}`,
        //     className: "eTimes",
        //     source: "证券时报·e公司",  //可在schema中配置规则覆盖
        //     classify: "caijing", //可在schema中配置规则覆盖
        //     detailSchema: "div.article-detail",
        //     schema: {
        //         source: "span.source",
        //         // tag: "div.article-tags",
        //         title: "h1",
        //         author_name: "div.author",
        //         // author_avatar_url: "",
        //         description: "div.content",
        //         pic_url: "",
        //         content: "div.content"
        //     },
        //     autoUpdate: '*/8 * * * *',
        //     jobName: "eTimes Job--->"
        // },
        // {
        //     url: `https://api-prod.wallstreetcn.com/apiv1/content/lives?channel=global-channel&client=pc&limit=20`,
        //     className: "wallStreet",
        //     source: "华尔街见闻",  //可在schema中配置规则覆盖
        //     classify: "shehui", //可在schema中配置规则覆盖
        //     extractor: "http://172.17.0.11:50001",
        //     schema: {
        //         // source: "span.source",
        //         // // tag: "div.article-tags",
        //         // title: "h1",
        //         // author_name: "div.author",
        //         // // author_avatar_url: "",
        //         // description: "div.content",
        //         // pic_url: "",
        //         // content: "div.content"
        //     },
        //     autoUpdate: '*/3 * * * *',
        //     jobName: "wallStreet Job--->"
        // },
        // {
        //     url: `http://36kr.com/api/newsflash?per_page=20`,
        //     className: "flash36kr",
        //     source: "36氪",  //可在schema中配置规则覆盖
        //     classify: "keji", //可在schema中配置规则覆盖
        //     extractor: "http://172.17.0.11:50001",
        //     schema: {
        //         // source: "span.source",
        //         // // tag: "div.article-tags",
        //         // title: "h1",
        //         // author_name: "div.author",
        //         // // author_avatar_url: "",
        //         // description: "div.content",
        //         // pic_url: "",
        //         // content: "div.content"
        //     },
        //     autoUpdate: '*/2 * * * *',
        //     jobName: "36kr Job--->"
        // },
        // {
        //     url: `http://www.tmtpost.com/nictation?r={random}`,
        //     className: "tmtPost",
        //     source: "钛媒体瞬眼播报",  //可在schema中配置规则覆盖
        //     classify: "keji", //可在schema中配置规则覆盖
        //     detailSchema: "article",
        //     schema: {
        //         // source: "span.source",
        //         // tag: "div.article-tags",
        //         // title: "h1",
        //         // author_name: "div.author",
        //         // author_avatar_url: "",
        //         // description: "div.content",
        //         pic_url: "",
        //         content: "p.inner"
        //     },
        //     autoUpdate: '*/2 * * * *',
        //     jobName: "tmtPost Job--->"
        // },
        // {
        //     url: `http://www.jiemian.com/lists/4.html?r={random}`,
        //     className: "jiemian",
        //     source: "界面新闻",  //可在schema中配置规则覆盖
        //     classify: "shehui", //可在schema中配置规则覆盖
        //     detailSchema: "div.article-view",
        //     schema: {
        //         // source: "span.source",
        //         // tag: "div.article-tags",
        //         // title: "h1",
        //         // author_name: "div.author",
        //         // author_avatar_url: "",
        //         // description: "div.content",
        //         pic_url: "",
        //         content: "div.article-content"
        //     },
        //     autoUpdate: '*/2 * * * *',
        //     jobName: "jiemian Job--->"
        // },
        {
            url: `http://roll.news.sina.com.cn/interface/rollnews_ch_out_interface.php?col=89&num=20&spec=&type=&date=&ch=01&k=&offset_page=0&offset_num=0&asc=&page=1&r={random}`,
            className: "sina",
            source: "新浪新闻",  //可在schema中配置规则覆盖
            classify: "shehui", //可在schema中配置规则覆盖
            detailSchema: "div.article-content-left",
            // extractor: "https://dev.extractor.bintutech.com",
            schema: {
                // source: "span.source",
                // tag: "div.article-tags",
                title: "h1.main-title",
                // author_name: "div.author",
                // author_avatar_url: "",
                // description: "div.content",
                pic_url: "",
                content: "div.article"
            },
            autoUpdate: '*/1 * * * *',
            jobName: "sina Job--->"
        }
    ];

exports.sql = {
    database: 'flash_news',
    username: "bintu_dev",
    password: 'BinTu_dev_1711', //"local_mysql"
    // username: "bintu_prod",
    // password: 'BintuMysqlProd_1802',
    options: {
        timezone: "+08:00",
        charset: "utf8",
        //dev 
        host: "sh-cdb-crdmx7q6.sql.tencentcdb.com",
        port: 63708,
        // //prod
        // host: "172.17.0.4",
        // port: 3306,
        dialect: 'mysql', // PostgreSQL, MySQL, MariaDB, SQLite and MSSQL See more: http://docs.sequelizejs.com/en/latest/
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    }
}

exports.extractor = "dev.extractor.bintutech.com";
