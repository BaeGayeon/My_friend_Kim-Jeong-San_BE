const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const User = require("./user");
const Account = require("./account");
const Payment = require("./payment");
const Room = require("./room");
const Receipt = require("./receipt");
const AccountBook = require("./accountBook");
const Menu = require("./menu");
const UserRoom = require("./userRoom");
const Item = require("./item");
const Vote = require("./vote");
const Poll = require("./poll");
const Friend = require("./friend");

const db = {};
const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
);

db.sequelize = sequelize;

//아래 추가
db.User = User;
db.Account = Account;
db.Payment = Payment;
db.Room = Room;
db.Receipt = Receipt;
db.Menu = Menu;
db.AccountBook = AccountBook;
db.UserRoom = UserRoom;
db.Item = Item;
db.Vote = Vote;
db.Poll = Poll;
db.Friend = Friend;

User.init(sequelize);
Account.init(sequelize);
Payment.init(sequelize);
Room.init(sequelize);
Receipt.init(sequelize);
AccountBook.init(sequelize);
Menu.init(sequelize);
UserRoom.init(sequelize);
Item.init(sequelize);
Vote.init(sequelize);
Poll.init(sequelize);
Friend.init(sequelize);

User.associate(db);
Account.associate(db);
Room.associate(db);
Receipt.associate(db);
Payment.associate(db);
Menu.associate(db);
UserRoom.associate(db);
Item.associate(db);
Vote.associate(db);
Poll.associate(db);
Friend.associate(db);

module.exports = db;
