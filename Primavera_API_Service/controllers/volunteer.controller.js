const Volunteer = require('../models/volunteer.model');
const User = require('../models/user.model');
const debug = require('debug')('app:volunteerController');

const controller = {};

controller.createVolunteer = async(req,res,next)=>{
    try {
        const {name,dui, birth_date,starting_date,occupation,university,phone_number,adress,service_type,year_studied} = req.body;

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
            adress,
            service_type,
            year_studied,
            age:age,
            active:true
        });

        await volunteer.save();

        return res.status(201).json({message:"Volunteer created successfully"});
    } catch (error) {
        
    }
}

controller.findVolunteer = async(req,res,next)=>{
    try {
        const {identifier} = req.params;
        let volunteer = await Volunteer.findOne({$or:[{dui:identifier},{_id:identifier},{name:identifier}]});
        if(!volunteer){
            return res.status(404).json({error:"Volunteer not found"});
        }

        return res.status(200).json(volunteer);
    } catch (error) {
        
    }
}

controller.getAllVolunteers = async(req,res,next)=>{
    try {
        const {page=1, limit=6, active=true} = req.query;
        const volunteers = await Volunteer.find({active:active}).limit(limit * 1).skip((page - 1) * limit);
        const count = await Volunteer.countDocuments();
        return res.status(200).json({
            volunteers,
            totalPages: Math.ceil(count/limit),
            currentPage: page
        });
    } catch (error) {
        
    }
}

controller.updateVolunteer = async(req,res,next)=>{
    try {
        const {identifier} = req.params;
        const {name,dui, birth_date,starting_date,occupation,university,phone_number,adress,service_type,year_studied} = req.body;
        

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
        volunteer.adress = adress;
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
        if(!volunteer){
            return res.status(404).json({error:"Volunteer not found"});
        }

       

        return res.status(200).json({message:"Volunteer deleted successfully"});
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

        
        await newUser.save();

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