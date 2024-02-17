const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var proCategorySchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    slug:{
        type:String,
        required:true,
        unique: true,
        lowercase:true  
    },
    lavel:{
        type:Number,
        required:false,
        default: 1,
    },
    parent:{
        type:Number,
        required:false,
        default: 0,
    },
    shortDes:{
        type:String,
        required:false,
    },
    description:{
        type:String,
        required:false,
    },
    image:{
        type:String,
        default:"",
    },
    metaTitle:{
        type:String,
        required:false,
    },
    metaDes:{
        type:String,
        required:false,
    },
    metaKey:{
        type:String,
        required:false,
    },
    isIndexed:{
        type:String,
        required:false,
    },
},{
    timestamps:true
});

//Export the model
module.exports = mongoose.model('ProCategory', proCategorySchema);