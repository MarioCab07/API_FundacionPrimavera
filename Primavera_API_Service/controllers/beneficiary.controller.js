const fs = require('fs-extra');
const path = require('path');

const Beneficiary = require('../models/beneficiary.model');
const debug = require('debug')('app:ben controller');



const controller ={};


controller.createBeneficiary = async (req,res,next) =>{
    try {
        const {
            name,
            dui,
            birth_date,
            starting_date,
            phone_number,
            adress,
            birth_place,
            work_occup,
            income_level,
            pension,
            weight,
            height,
            phone_company,
            whatsapp,
            illness,
            medicines,
            blood_type,
            personIC_name,
            personIC_phone_number,
            personIC_dui,
            medical_service,
            house_type,
            shirt_size,
            shoe_size,
            discapacities,
            affiliation,
            dependents,
            active,
            reason
        } = req.body;


        const age = new Date().getFullYear() - new Date(birth_date).getFullYear();

        let beneficiary = await Beneficiary.findOne({dui:dui});
        if(beneficiary){
            return res.status(409).json({error:"Beneficiary already exists"});
        }



        const personIC ={
            name:personIC_name,
            phone_number:personIC_phone_number,
            dui:personIC_dui
        }

        const isActive = {
            active:active,
            reason:reason

        }
        
        beneficiary =  new Beneficiary({
            name : name,
            dui : dui,
            birth_date : birth_date,
            starting_date : starting_date,
            phone_number : phone_number,
            adress : adress,
            birth_place : birth_place,
            work_occup : work_occup,
            income_level : income_level,
            pension : pension,
            weight : weight,
            height : height,
            phone_company : phone_company,
            whatsapp : whatsapp,
            illness : illness,
            medicines : medicines,
            blood_type : blood_type,
            person_in_charge : personIC,
            medical_service : medical_service,
            house_type : house_type,
            shirt_size : shirt_size,
            shoe_size : shoe_size,
            discapacities : discapacities,
            affiliation : affiliation,
            dependents : dependents,
            active : isActive,
            age:age

        });

        if (req.file) {
            beneficiary.photo = req.file.path;
          }

        await beneficiary.save();

        return res.status(201).json({message:"Beneficiary created successfully"});

    } catch (error) {
        debug("Error in createBeneficiary", error);
    }

}

controller.getAllBeneficieries = async(req,res,next)=>{
    try {
        let {page =1, limit = 6 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const beneficiaries = await Beneficiary.find({ 'active.value': true })
                                    .skip((page-1)*limit)
                                    .limit(parseInt(limit));

        const total = await Beneficiary.countDocuments();

        return res.status(200).json({beneficiaries,total,page,pages:Math.ceil(total/limit)});
    } catch (error) {
        
    }
}

controller.getInactiveBeneficiaries = async(req,res,next)=>{
    try {
        let {page =1, limit = 6 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const beneficiaries = await Beneficiary.find({ 'active.value': false })
                                    .skip((page-1)*limit)
                                    .limit(parseInt(limit));

        const total = await Beneficiary.countDocuments();
        return res.status(200).json({beneficiaries,total,page,pages:Math.ceil(total/limit)});
    } catch (error) {
        
    }
}

controller.findBeneciary = async(req,res,next)=>{
    try {
        const {identifier} = req.params;
        const beneficiary = await Beneficiary.findOne({$or:[{dui:identifier},{name:identifier},{_id:identifier}]});
        if(!beneficiary){
            return res.status(404).json({error:"Beneficiary not found"});
        }

        return res.status(200).json(beneficiary);

    } catch (error) {
        
    }
}

controller.updateBeneficiary = async(req,res,next)=>{
    try {
        const {
            name,
            dui,
            birth_date,
            starting_date,
            phone_number,
            adress,
            birth_place,
            work_occup,
            income_level,
            pension,
            weight,
            height,
            phone_company,
            whatsapp,
            illness,
            medicines,
            blood_type,
            personIC_name,
            personIC_phone_number,
            personIC_dui,
            medical_service,
            house_type,
            shirt_size,
            shoe_size,
            discapacities,
            affiliation,
            dependents,
            active,
            reason
        } = req.body;

        const {identifier} = req.params;

        let beneficiary = await Beneficiary.findById(id);
        if(!beneficiary){
            return res.status(404).json({error:"Beneficiary not found"});
        }

        const personIC ={
            name:personIC_name,
            phone_number:personIC_phone_number,
            dui:personIC_dui
        }

        const isActive = {
            active:active,
            reason:reason

        }

        beneficiary.name = name;
        beneficiary.dui = dui;
        beneficiary.birth_date = birth_date;
        beneficiary.starting_date = starting_date;
        beneficiary.phone_number = phone_number;
        beneficiary.adress = adress;
        beneficiary.birth_place = birth_place;
        beneficiary.work_occup = work_occup;
        beneficiary.income_level = income_level;
        beneficiary.pension = pension;
        beneficiary.weight = weight;
        beneficiary.height = height;
        beneficiary.phone_company = phone_company;
        beneficiary.whatsapp = whatsapp;
        beneficiary.illness = illness;
        beneficiary.medicines = medicines;
        beneficiary.blood_type = blood_type;
        beneficiary.person_in_charge = personIC;
        beneficiary.medical_service = medical_service;
        beneficiary.house_type = house_type;
        beneficiary.shirt_size = shirt_size;
        beneficiary.shoe_size = shoe_size;
        beneficiary.discapacities = discapacities;
        beneficiary.affiliation = affiliation;
        beneficiary.dependents = dependents;
        beneficiary.active = isActive;

        await beneficiary.save();

        return res.status(200).json({message:"Beneficiary updated successfully"});

    } catch (error) {
        
    }
}

controller.toggleActiveBeneficiary = async(req,res,next)=>{
    try {
        const {identifier} = req.params;
        const {reason} = req.body;
        let beneficiary = await Beneficiary.findById(identifier);
        if(!beneficiary){
            return res.status(404).json({error:"Beneficiary not found"});
        }
        let value = !beneficiary.active.value;

       beneficiary.active={
        value:value,
        reason:reason
       }

        await beneficiary.save();

        return res.status(200).json({message:"Beneficiary deactivated successfully"});

    } catch (error) {
        
    }
}

controller.getPhoto = async(req,res,next)=>{
    try {
        const {identifier} = req.params;
        const beneficiary = await Beneficiary.findById(identifier);
        if(!beneficiary){
            return res.status(404).json({error:"Beneficiary not found"});
        }

        if(!beneficiary.photo){
            return res.status(404).json({error:"Beneficiary has no photo"});
        }

        return res.sendFile(path.resolve(beneficiary.photo));

    } catch (error) {
        
    }
}

controller.uploadDocument = async(req,res,next)=>{
    try {
        const {identifier} = req.params;
        const beneficiary = await Beneficiary.findById(identifier);
        if(!beneficiary){
            return res.status(404).json({error:"Beneficiary not found"});
        }

        if(!req.files){
            return res.status(400).json({error:"No file was uploaded"});
        }

        const _paths = req.files.map(file=>file.path);
        beneficiary.files = _paths;
        
        await beneficiary.save();        
        
        return res.status(200).json({message:"Document uploaded successfully"});



    } catch (error) {
        
    }
}

controller.getBeneficiaryDocuments = async(req,res,next)=>{
    try {
        const {identifier} = req.params;
        const beneficiary = await Beneficiary.findById(identifier);
        if(!beneficiary){
            return res.status(404).json({error:"Beneficiary not found"});
        }

        const documentsURLSs = beneficiary.files.map(file =>{
            let normalizedPath = file.replace(/\\/g, '/');
            normalizedPath = encodeURI(normalizedPath);
            return `${req.protocol}://${req.get('host')}/${normalizedPath}`;
        })

        return res.status(200).json({documents : documentsURLSs});

    } catch (error) {
        
    }
}

controller.deleteDocument = async (req,res,next)=>{
    try {
        const {identifier} = req.params;
        const {fileName} = req.body;

        const beneficiary = await Beneficiary.findById(identifier);
        if(!beneficiary){
            return res.status(404).json({error:"Beneficiary not found"});
        }

        const filePath = beneficiary.files.find(file=>file.includes(fileName));
        if(!filePath){
            return res.status(404).json({error:"File not found"});
        }

        
        if (await fs.pathExists(filePath)) {
            await fs.remove(filePath);
          }
        
        beneficiary.files = beneficiary.files.filter(file=>!file.includes(fileName));
        await beneficiary.save();

        

        return res.status(200).json({message:"Document deleted successfully"});
    } catch (error) {
        
    }
}

module.exports = controller;