const Sequelize = require("sequelize");
const { sequelize, User, Friend } = require("./index");
module.exports = class Friend extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                name: {
                    type: Sequelize.STRING(20),
                    allowNull: false,
                },
                friendUserId: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                profilePhoto: {
                    type: Sequelize.STRING(200),
                    allowNull: true,
                },
                accounts: {
                    type: Sequelize.JSON,
                    allowNull: true,
                },
            },
            {
                sequelize,
                timestamps: true,
                underscored: false,
                modelName: "Friend",
                tableName: "friends",
                paranoid: true,
                charset: "utf8mb4",
                collate: "utf8mb4_general_ci",
            }
        );
    }
    static associate(db) {
        db.User.hasMany(db.Friend);
        db.Friend.belongsTo(db.User);
    }
};