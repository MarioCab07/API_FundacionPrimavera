const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const volunteerSchema = new Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    dui:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    birth_date:{
        type: Date,
        required: true
    },
    starting_date:{
        type: Date,
        required: true
    },
    occupation:{
        type: String,
        required: true
    },
    university:{
        type: String,
    },
    phone_number:{
        type: String,
        required: true,
        trim: true
    },
    adress:{
        type: String,
        required: true,
        trim: true
    },
    service_type:{
        type: String,
        required: true
    },
    year_studied:{
        type: Number,
        
    },
    age:{
        type: Number,
        required: true
    },
    active:{
        type: Boolean,
        default: true
    }


},{timestamps:true});

module.exports = Mongoose.model('Volunteer', volunteerSchema);