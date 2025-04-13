const Mongoose = require('mongoose');

const { Schema } = Mongoose;

const petitionSchema = new Schema({
    volunteerId:{
        type: Mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Volunteer'
    },
    userId:{
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    action:{
        type: String,
        required: true,
        enum :["deleteUser","createUser"]
    },
    details:{
        type:String
    },
    status:{
        type: String,
        required: true,
        enum :["pending","accepted","rejected"]
    },
    dui:{
        type: String
    }
},{timestamps: true});

module.exports = Mongoose.model('Petition', petitionSchema);