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
        
    },
    starting_date:{
        type: Date,
        
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
        
        trim: true
    },
    birth_place:{
        type: String,
        
        trim: true
    },
    occupation:{
        type: String,
        trim: true,
        default: "N/A"
    },
    write_and_read:{
        type: Boolean,
        
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
        
        trim: true
    },
    people_in_house:{
        quantity: {
            type: Number,
            
            default:0
        },
        relationship: {
            type: String,
            default:"N/A"

        }
    },
    shirt_size:{
        type: String,
        
    },
    shoe_size:{
        type: String,
        
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
                
                trim: true
            },
            url:{
                type: String,
                
                trim: true
            },
            path:{
                type: String,
                
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
        
    },
    department:{
        type: String,
        
        trim: true
    },
    municipality:{
        type: String,
        
        trim: true
    },
    zone:{
        type: String,
        
        trim: true
    },
    reference_address:{
        type: String,
        trim: true
    },
    referral_source:{
        type: String,
        
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