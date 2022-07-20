const Sequelize = require("../models/index");
const userService = require("./userService");

module.exports = {
    createRoom: async function (req, transaction) {
        const room = await Sequelize.Room.create(
            {
                name: req.body.name,
                color: req.body.color,
                startDate: req.body.startDate,
                startTime: req.body.startTime,
                group: req.body.group,
            },
            {
                transaction: transaction,
            }
        );
        const group = req.body.group;
        if (group)
            group.forEach((userId) => {
                userService.findUserById(userId).then((user) => {
                    if (user) room.addUser(user.id);
                });
            });
    },
    deleteRoomById: async function (id, transaction) {
        return await Sequelize.Room.destroy(
            { where: { id: id } },
            { transaction: transaction }
        );
    },
    deleteParticipantById: async function (id, userId, transaction) {
        const room = await Sequelize.Room.findOne({ where: { id: id } });
        if (room == null) throw new Error("모임방을 찾을 수 없습니다.");
        let group = room.group;

        if (group) {
            group = group.filter((member) => {
                return member != userId;
            });
            if (group.length > 0)
                await Sequelize.Room.update(
                    { group: group },
                    { where: { id: id } },
                    { transaction }
                );
            else {
                await Sequelize.Room.destroy(
                    { where: { id: id } },
                    { transaction }
                );
            }
        }
    },
};
