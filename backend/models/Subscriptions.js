const { DataTypes } = require('sequelize');
const sequelize = require("../utils/db.js");

const Subscriptions = sequelize.define("Subscriptions",{
    endpoint: {
        type: DataTypes.STRING,
    },   
    key_p256dh: {
        type: DataTypes.STRING,
    },
    key_auth: {
        type: DataTypes.STRING,
    },
},{

});
//Subscriptions.sync()
module.exports = Subscriptions;