'use strict';

import config from '../config';
import Sequelize from 'sequelize';
import cls from 'continuation-local-storage';

var namespace = cls.createNamespace('bintu-wishlist');

Sequelize.useCLS(namespace);
var db = {
    sequelize: new Sequelize(
        config.sql.database,
        config.sql.username,
        config.sql.password,
        config.sql.options
    )
};

db.Classify = db.sequelize.import("./classify");
db.Tags = db.sequelize.import("./tags");
db.News = db.sequelize.import("./news");
db.NewsDetails = db.sequelize.import("./newsDetails");
db.NewsTags = db.sequelize.import("./newsTags");

// console.log("modelName--->", db["User"].options.classMethods.associate)
Object.keys(db).forEach(function (modelName) {
    if (db[modelName].options && db[modelName].options.classMethods && 'associate' in db[modelName].options.classMethods) {
        db[modelName].options.classMethods.associate(db);
    }
});

export { db };
