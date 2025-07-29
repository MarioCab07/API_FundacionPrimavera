const Mongoose = require('mongoose');
const { Schema } = Mongoose;

const beneficiarySchema = new Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    photo:{
        type:String
    }
    ,
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
    }
    ,
    phone_number:{
        type: String,
        trim: true
    },
    adress:{
        type: String,
        required: true,
        trim: true
    },
    birth_place:{
        type: String,
        required: true,
        trim: true
    },
    work_occup:{
        type: String,
        

    },
    income_level:{
        type: String,
        required: true,
    },
    pension:{
        type: Boolean,
        required: true,
    },
    weight:{
        type: Number,
        required: true
    },
    height:{
        type: Number,
        required: true
    },
    phone_company:{
        type: String,
        
        trim: true,
        default:""
    },
    whatsapp:{
        type: Boolean,
        required: true
    },
    illness:{
        type:[String],
        default:[]

    },
    medicines:{
        type:[String],
        default:[]
    },
    blood_type:{
        type: String,
        
    },
    person_in_charge:{
        name:{
            type: String,
            default : "",
            trim: true
        },
        phone_number:{
            type: String,
            trim: true,
            default : ""
        },
        dui:{
            type: String,
            default : "",
            trim: true
        },
        default:{}
    },
    medical_service:{
        type: String,
        default:""
        
    },
    house_type:{
        type: String,
        required: true
    },
    shirt_size:{
        type: String,
        required: true
    },
    shoe_size:{
        type: String,
        required: true
    },
    discapacities:{
        type:[String],
        default:[]
    },
    affiliation:{
        type: String,
        default:"Fundacion Primavera"
    },
    dependents:{
        type:[String],
        default:[]
    },
    files:{
        type:[{
            name:{
                type: String,
                required: true,
                trim: true
            },
            url:{
                type: String,
                required: true,
                trim: true
            },
            path:{
                type: String,
                required: true,
                trim: true
            },
            date:{
                type: Date,
                default: Date.now()
            }
        }],
        default:[]
    },
    active: {
        value: { type: Boolean, default: true },
        reason: { type: String, default: "" }
      },
    age:{
        type: Number,
        default:0
    },
    gender:{
        type: String,
        trim:true,
        required:true
    }



},{timestamps: true});


module.exports  = Mongoose.model('Beneficiary', beneficiarySchema);