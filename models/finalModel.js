import History from "../models/historyModel.js";
import Users from "../models/userModel.js";

History.associate = function (models) {
  History.belongsTo(models.Users, {
    foreignKey: "user_email",
    targetKey: "email",
  });
};
Users.associate = function (models) {
  Users.hasMany(models.History, {
    foreignKey: "user_email",
    sourceKey: "email",
  });
};

export { Users, History };
