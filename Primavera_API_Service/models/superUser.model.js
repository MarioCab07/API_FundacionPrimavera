const Mongoose =require('mongoose');
const { Schema } = Mongoose;
const crypto =require('crypto');
const debug = require('debug')('app:superUserModel');
const {ROLES} = require('../data/roles.data')




const superUserSchema = new Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },

    username:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },

    hashedPassword:{
        type: String,
        required: true
    },
    salt:{
        type: String,
        required: true
    },

    role: {
        type: String,
        default: 'SUPER_ADMIN'
    },
    tokens:{
        type: [String],
        default: []
    }

},{timestamps: true});

superUserSchema.methods={
    encryptPassword : function(password){
        if(!password) return '';
        try {
            const _password =  crypto.pbkdf2Sync(
                password,
                this.salt,
                1000,
                64,
                `sha512`
           ).toString(`hex`);

           return _password;
        
        } catch (error) {
            debug("Error in encryptPassword", error);
            return '';
        }        
    },
    makeSalt: function(){
        return crypto.randomBytes(16).toString('hex');
    },
    comparePassword: function(password){
        return this.encryptPassword(password) === this.hashedPassword
    }

};

superUserSchema
    .virtual('password')
    .set(function(password = crypto.randomBytes(16).toString('hex')){
        this.salt = this.makeSalt();
        this.hashedPassword = this.encryptPassword(password);
});

module.exports =  Mongoose.model('SuperUser', superUserSchema);