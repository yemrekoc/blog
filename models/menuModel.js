const mongoose = require('mongoose');


const menuSchema = new mongoose.Schema({
    menuName    : String,
    menuComSentence:String,
    menuImageName   : String
});

module.exports = mongoose.model("Menu",menuSchema);