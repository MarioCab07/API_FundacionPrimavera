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
    home_phone:{
        type: String,
        trim: true
    },
    address:{
        type: String,
        required: true,
        trim: true
    },
    birth_place:{
        type: String,
        required: true,
        trim: true
    },
    occupation:{
        type: String,
        trim: true,
        default: "N/A"
    },
    write_and_read:{
        type: Boolean,
        required: true
    },
    education_level:{
        type: String,
        
        trim: true
    },
    income_type:{
        type: String,
    },
    weight:{
        type: Number,

    },
    height:{
        type: Number,

    },
    phone_company:{
        type: String,
        
        trim: true,
        default:"N/A"
    },
    whatsapp:{
        type: Boolean,
        required: true
    },
    illness:{
        type:String,
        default:"N/A"

    },
    medicines:{
        type:String,
        default:"N/A"
    },
    blood_type:{
        type: String,
        
    },
    person_in_charge:{
        name:{
            type: String,
            default : "N/A",
            trim: true
        },
        phone_number:{
            type: String,
            trim: true,
            default : "N/A"
        },
        dui:{
            type: String,
            default : "N/A",
            trim: true
        },
        default:{}
    },
    medical_service:{
        type: String,
        default:"N/A"
        
    },
    house_condition:{
        type: String,
        required: true,
        trim: true
    },
    people_in_house:{
        quantity: {
            type: Number,
            required: true,
            default:0
        },
        relationship: {
            type: String,
            default:"N/A"

        }
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
        type:String,
        default:"N/A"
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
    },
    department:{
        type: String,
        required: true,
        trim: true
    },
    municipality:{
        type: String,
        required: true,
        trim: true
    },
    zone:{
        type: String,
        required: true,
        trim: true
    },
    reference_address:{
        type: String,
        trim: true
    },
    referral_source:{
        type: String,
        required: true,
        trim: true
    },
    transportation:{
        difficulty: {
            type: Boolean,
            default: false
        },
        person_available: {
            type: Boolean,
            default: false
        },
    },
    agreement:{
        type: Boolean,
        default: true
    },
    created_by:{
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'created_byModel'
    },
     created_byModel: {
    type: String,
    required: true,
    enum: ['User', 'SuperUser']
  },
  community:{
    type: String
  }



},{timestamps: true});


module.exports  = Mongoose.model('Beneficiary', beneficiarySchema);