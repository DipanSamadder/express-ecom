const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var colorSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    colorCode:{
        type:String,
        required:false,
    },
    shortDes:{
        type:String,
        required:false,
    },
    image:{
        type:String,
        default:"",
    },
    isIndexed:{
        type:String,
        required:false,
    },
},{
    timestamps:true
});

//Export the model
module.exports = mongoose.model('Color', colorSchema);