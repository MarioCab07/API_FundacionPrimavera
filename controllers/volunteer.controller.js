const Volunteer = require('../models/volunteer.model');
const User = require('../models/user.model');
const Petition = require('../models/petition.model')
const debug = require('debug')('app:volunteerController');

const controller = {};

controller.createVolunteer = async(req,res,next)=>{
    try {
        const {name,dui, birth_date,starting_date,occupation,university,phone_number,address,service_type,year_studied,gender,ending_date} = req.body;

        let volunteer = await Volunteer.findOne({dui});
        if(volunteer){
            return res.status(400).json({error:"Volunteer already exists"});
        }

        const age = new Date().getFullYear() - new Date(birth_date).getFullYear();

        volunteer = new Volunteer({
            name,
            dui,
            birth_date,
            starting_date,
            occupation,
            university,
            phone_number,
            address,
            service_type,
            year_studied,
            age:age,
            active:true,
            gender,
            ending_date
        });

        await volunteer.save();

        const associateUser = await User.findOne({dui:dui});
        
        if(!associateUser){
            const petition = new Petition({
                volunteerId:volunteer._id,
                action:"createUser",
                status:"pending",
                details:`El voluntario ${volunteer.name} fue creado. ¿Desea crear un usuario asociado?`
            });

            await petition.save();
        }
        

        return res.status(201).json({message:"Volunteer created successfully"});
    } catch (error) {
        debug(error);
    }
}

controller.findVolunteer = async(req,res,next)=>{
    try {
        const {identifier} = req.params;
        const decodeId = decodeURIComponent(identifier);
        const volunteer = await Volunteer.find({$or:[{dui:{$regex:decodeId}},{name:{$regex:decodeId, $options:'i'}}]}).select('name age dui active service_type');
        if(!volunteer){
            return res.status(404).json({error:"Volunteer not found"});
        }

        return res.status(200).json(volunteer);
    } catch (error) {
        
    }
}

controller.getAllVolunteers = async(req,res,next)=>{
    try {
        let {page=1, limit=6, active=true} = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const volunteers = await Volunteer.find({active:active}).skip((page-1)*limit).limit(parseInt(limit));
        const total = await Volunteer.countDocuments({active:active});
        return res.status(200).json({
            volunteers,
            total,
            page,
            pages: Math.ceil(total/limit)
        });
    } catch (error) {
        
    }
}

controller.updateVolunteer = async(req,res,next)=>{
    try {
        const {identifier} = req.params;
        const {name,dui, birth_date,starting_date,occupation,university,phone_number,address,service_type,year_studied} = req.body;
        

        let volunteer = await Volunteer.findById(identifier);
        if(!volunteer){
            return res.status(404).json({error:"Volunteer not found"});
        }

        volunteer.name = name;
        volunteer.dui = dui;
        volunteer.birth_date = birth_date;
        volunteer.starting_date = starting_date;
        volunteer.occupation = occupation;
        volunteer.university = university;
        volunteer.phone_number = phone_number;
        volunteer.address = address;
        volunteer.service_type = service_type;
        volunteer.year_studied = year_studied;

        await volunteer.save();

        return res.status(200).json({message:"Volunteer updated successfully"});
    } catch (error) {
        
    }
}

controller.deleteVolunteer = async(req,res,next)=>{
    try {
        const {identifier} = req.params;
        let volunteer = await Volunteer.findByIdAndDelete(identifier);
        const {dui} = volunteer;
        if(!volunteer){
            return res.status(404).json({error:"Volunteer not found"});
        }

        const associatedUser = await User.findOneAndDelete({dui:dui});

        

    

        return res.status(200).json({message:"Volunteer deleted successfully"});
    } catch (error) {
        
    }
}

controller.deleteVolunteerUser = async(req,res,next)=>{
    try {
        const {identifier} = req.params;
        let volunteer = await Volunteer.findByIdAndDelete(identifier);
        if(!volunteer){
            return res.status(404).json({error:"Volunteer not found"}); 
        }
        const {dui} = volunteer;
        const associatedUser = await User.findOne({dui:dui});
        if(associatedUser){
            await User.findByIdAndDelete(associatedUser._id);
        }

        return res.status(200).json({message:"Volunteer and associated user deleted successfully"});


    } catch (error) {
        
    }
}

controller.createVolunteerUser = async(req,res,next)=>{
    try {
        
        const {identifier} = req.params;
        let volunteer = await Volunteer.findById(identifier);
        

        if(!volunteer){
            return res.status(404).json({error:"Volunteer not found"});
        }

        const {name,dui,phone_number} = volunteer;

        let newUser = await User.findOne({dui:dui});
        if(newUser){
            return res.status(400).json({error:"User already exists"});
        }

        

        newUser = new User({
            name:name,
            dui:dui,
            phone_number:phone_number,
            role:"VOLUNTARIO"
        });


        newUser.encryptPassword();
        const password = newUser.desencryptPassword();
        newUser.generateUser();
        volunteer.userName = newUser.username;

        
        await newUser.save();
        await volunteer.save();

        return res.status(201).json({message:"User created successfully",username:newUser.username,password:password});

        

    } catch (error) {
        
    }
}

controller.toggleActive = async(req,res,next)=>{
    try {
        const {identifier} = req.params;
        let volunteer = await Volunteer.findById(identifier);
            
        if(!volunteer){
            return res.status(404).json({error:"Volunteer not found"});
        }

        volunteer.active = !volunteer.active;
        await volunteer.save();

        return res.status(200).json({message:`Volunteer ${volunteer.active ? 'activated' : 'deactivated'} successfully`});

        
    } catch (error) {
        
    }
}







module.exports = controller;