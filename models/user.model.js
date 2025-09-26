const Mongoose = require('mongoose');
const { Schema } = Mongoose;
const crypto = require('crypto');
const {ROLES} = require('../data/roles.data')
const debug = require('debug')('app:userModel');

const secretKey = crypto.createHash('sha256')
.update(process.env.SECRET_KEY)
.digest();


const userSchema = new Schema({

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
    phone_number:{
        type: String,
        required: true,
        trim: true
    },
    username:{
        type: String,
        required: true,
        trim: true,
        
    },
    role: {
        type: String,
        default: 'VOLUNTARIO'
    },
    encryptedPassword:{
        type: String,
        required: true
    },
    tokens:{
        type: [String],
        default: []
    },
    email:{
        type: String,
        trim: true,
        lowercase: true,
    }

},{timestamps: true});

userSchema.methods = {

    encryptPassword : function (){
        let password = crypto.randomBytes(8).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
        const _n = Math.floor(Math.random() * 90) + 10;
        password += _n;

        try {
            const iv = crypto.randomBytes(16);
            const cipher = crypto.createCipheriv('aes-256-gcm',Buffer.from(secretKey),iv);
            let encrypted = cipher.update(password,'utf8','hex');
            encrypted += cipher.final('hex');
            const authTag = cipher.getAuthTag().toString('hex');
            this.encryptedPassword = `${iv.toString('hex')}:${authTag}:${encrypted}`;
        } catch (error) {
            debug("Error in encryptPassword", error);
            return '';
        }

    },
    desencryptPassword : function (){
        try {
            const [iv, authTag, encrypted] = this.encryptedPassword.split(':');
            const decipher = crypto.createDecipheriv('aes-256-gcm',Buffer.from(secretKey),Buffer.from(iv,'hex'));
            decipher.setAuthTag(Buffer.from(authTag,'hex'));
            let decrypted = decipher.update(encrypted,'hex','utf8');
            decrypted += decipher.final('utf8');
            
            return decrypted;
        } catch (error) {
            debug("Error in desencryptPassword", error);
            return '';
        }
    },
    comparePassword : function (password){
        return this.desencryptPassword() === password;
    },
    generateUser : function(){
        const _username = this.name.split(' ');
        if(_username.length < 2){
            return ''
        }
    
        const first = _username[0].toLowerCase(); // Primeras 4 letras del primer nombre
        const second = _username[2] ? _username[2].slice(0, 4).toLowerCase() : _username[1].slice(0, 4).toLowerCase();
        const number = Math.floor(Math.random() * 1000) // entre 0 y 999
    .toString()
    .padStart(3, "0");
        this.username = `${first}_${second}${number}`;
    }
}



module.exports = Mongoose.model('User',userSchema);