/**
 * 文章对应关键词
 */

module.exports = (sequelize, DataTypes) => {
    var NewsTags = sequelize.define( "news_tags", {
        id: {
            type: DataTypes.INTEGER(11),
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        create_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },{
        tableName: 'news_tags',
        timestamps: false,
        underscored: true,

        classMethods: {
            associate: function (models) {
                NewsTags.belongsTo( models.News );
                NewsTags.belongsTo( models.Tags );
            },
        }
    });
    return NewsTags;
}
