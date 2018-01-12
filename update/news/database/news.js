/**
 * 新闻列表
 */

module.exports = (sequelize, DataTypes) => {
    var News = sequelize.define( "news", {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 0 // values: 0: 隐藏 1:显示 2:热点
        },
        title: DataTypes.STRING(50), //标题
        description: DataTypes.STRING(300), //描述
        pic_url: DataTypes.STRING(1024), //展示图
        source_key: DataTypes.STRING(50),
        source_url: DataTypes.STRING(1024), //文章来源url
        source_name: DataTypes.STRING(32), //源站名称（如：大公网,凤凰网...）
        author_name: DataTypes.STRING(32), //文章作者
        source_create_date: { //源站文章创建时间
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        share_num: { //分享次数
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        read_num: { //阅读次数
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        create_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        update_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },{
        tableName: 'news',
        timestamps: false,
        underscored: true,
        classMethods: {
            associate: function (models) {
                News.belongsTo( models.Classify );

                News.hasOne(models.NewsDetails);
                News.hasMany(models.NewsTags);
            },
        }
    });
    return News;
}
