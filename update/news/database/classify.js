/**
 * 类目
 */

module.exports = (sequelize, DataTypes) => {
    var Classify = sequelize.define( "classify", {
        id: {
            type: DataTypes.STRING(20),
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        pid: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: ""
        },
        name: DataTypes.STRING(100),
        weight: {
            type: DataTypes.INTEGER(11), //排序权重
            allowNull: false,
            defaultValue: 0
        },
        create_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },{
        tableName: 'classify',
        timestamps: false,
        underscored: true,

        classMethods: {
            associate: function (models) {
                Classify.hasMany(models.News);
                // Classify.hasMany(models.FollowClassify);
            },
        }
    });
    return Classify;
}

/*
INSERT INTO `classify` (`id`, `pid`, `name`, `weight`, `create_date`) VALUES
(1, 0, '资讯', 0, '2017-12-17 00:00:00'),
(2, 0, '娱乐', 0, '2017-12-17 00:00:00'),
(3, 0, '体育', 0, '2017-12-17 00:00:00'),
(4, 0, '汽车', 0, '2017-12-17 00:00:00'),
(5, 0, '时尚', 0, '2017-12-17 00:00:00'),
(6, 0, '军事', 0, '2017-12-17 00:00:00'),
(7, 0, '房产', 0, '2017-12-17 00:00:00'),
(8, 0, '科技', 0, '2017-12-17 00:00:00');
* */

