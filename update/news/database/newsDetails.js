/**
 * 新闻详情
 */

module.exports = (sequelize, DataTypes) => {
    var NewsDetails = sequelize.define("news_details", {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        content: DataTypes.TEXT, // 文章内容详情 json [ { "text": "2" }, { "text": "3" }, { "img": "2" } ]
        create_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
            tableName: 'news_details',
            timestamps: false,
            underscored: true,
            classMethods: {
                associate: function (models) {
                    NewsDetails.News = NewsDetails.belongsTo(models.News);
                },
            }
        });
    return NewsDetails;
}
