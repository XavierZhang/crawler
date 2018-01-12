/**
 * 关键词
 **/

module.exports = (sequelize, DataTypes) => {
    var Tags = sequelize.define( "tags", {
        id: {
            type: DataTypes.INTEGER(11),
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        content: DataTypes.STRING(32),
        create_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },{
        tableName: 'tags',
        timestamps: false,
        underscored: true,

        classMethods: {
            associate: function (models) {
                Tags.hasMany( models.NewsTags );
            },
        }
    });
    return Tags;
}

