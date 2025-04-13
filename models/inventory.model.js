const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const inventorySchema = new Schema({

    product:{
        type:String,
        trim: true,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        trim:true
    },
    category:{
        type:String,
        trim:true
    },
    state:{
        type:String,
        trim:true,
        required:true
    },
    image:{
        type:String,
        
    },
    provider:{
        type:String,
        trim:true
    },
    origin:{
        type:String,
        trim:true
    },
    acquisition_date:{
        type:Date,
        required:true
    },


},{timestamps:true});



module.exports = Mongoose.model('Inventory', inventorySchema);