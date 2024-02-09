const { DataTypes } = require('sequelize');
const sequelize = require("../utils/db.js");

const Tweets = sequelize.define("Tweets",{
    title: {
        type: DataTypes.STRING,
    },   
    message: {
        type: DataTypes.STRING,
    }, 
},{

});

module.exports = Tweets;