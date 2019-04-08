const mongoose = require('mongoose');

const IcerikSchema = new mongoose.Schema({

    menu:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Menu"
        },
        menuName:String
    },
    icerikTitle:String,
    icerik:String
});

module.exports = mongoose.model("Icerik",IcerikSchema);