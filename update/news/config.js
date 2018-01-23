exports.sources =
    [
        {
            url: `http://www.egsea.com/index.php?app=Company&mod=Index&act=flash&ajax=true&pageLastTimeStamp={timestamp}`,
            className: "eTimes",
            source: "证券时报·e公司",  //可在schema中配置规则覆盖
            classify: "caijing", //可在schema中配置规则覆盖
            schema: {
                source: "span.source",
                // tag: "div.article-tags",
                title: "h1",
                author_name: "div.author",
                // author_avatar_url: "",
                description: "div.content",
                pic_url: "",
                content: "div.content"
            },
            autoUpdate: '*/8 * * * *',
            jobName: "eTimes Job--->"
        },
        // {
        //     url: `https://api-prod.wallstreetcn.com/apiv1/content/lives?channel=global-channel&client=pc&limit=20`,
        //     className: "wallStreet",
        //     source: "华尔街见闻",  //可在schema中配置规则覆盖
        //     classify: "shehui", //可在schema中配置规则覆盖
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
        // }
    ];

exports.sql = {
    database: 'flash_news',
    username: "bintu_dev",
    password: 'BinTu_dev_1711', //"local_mysql"
    options: {
        timezone: "+08:00",
        charset: "utf8",
        host: "sh-cdb-crdmx7q6.sql.tencentcdb.com",
        port: 63708,
        dialect: 'mysql', // PostgreSQL, MySQL, MariaDB, SQLite and MSSQL See more: http://docs.sequelizejs.com/en/latest/
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    }
}

exports.extractor = "dev.extractor.bintutech.com";
