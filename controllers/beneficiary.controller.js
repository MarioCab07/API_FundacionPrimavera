const fs = require('fs-extra');
const path = require('path');
const bucket  = require('../config/firebase');

const Beneficiary = require('../models/beneficiary.model');
const debug = require('debug')('app:ben controller');
const {sanitizeName} = require('../utils/general.tools');
const {AsyncParser}  = require("@json2csv/node")



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
            reason,
            gender
        } = req.body;
        

        let foldername = `beneficiaries/${sanitizeName(name)}`;

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
            value:active,
            reason:reason

        }
        let newDependentes = JSON.parse(dependents)
        
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
            dependents : newDependentes,
            active : isActive,
            age:age,
            gender:gender

        });

        if (req.file) {
            const ext = path.extname(req.file.originalname);
            const filename = `${foldername}/photo${ext}`;
            const file = bucket.file(filename);

            await file.save(req.file.buffer,{
                metadata:{
                    contentType: req.file.mimetype
                }
            });

            await file.makePublic();
            beneficiary.photo = `https://storage.googleapis.com/${bucket.name}/${filename}`;
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

        const total = await Beneficiary.countDocuments({'active.value': true});

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

        const total = await Beneficiary.countDocuments({ 'active.value': false });
        return res.status(200).json({beneficiaries,total,page,pages:Math.ceil(total/limit)});
    } catch (error) {
        
    }
}

controller.findBeneciary = async(req,res,next)=>{
    try {
        const {identifier} = req.params;
        const decodeId = decodeURIComponent(identifier);
        
        const beneficiary = await Beneficiary.findOne({$or:[{dui:decodeId},{name:decodeId}],'active.value':true});
        
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

        let beneficiary = await Beneficiary.findById(identifier);
        if(!beneficiary){
            return res.status(404).json({error:"Beneficiary not found"});
        }

        const personIC ={
            name:personIC_name,
            phone_number:personIC_phone_number,
            dui:personIC_dui
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
        beneficiary.active.value = true;
        beneficiary.active.reason = reason;

        await beneficiary.save();

        return res.status(200).json({message:"Beneficiary updated successfully",beneficiary});

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

        return res.status(200).json({message:"Beneficiary deactivated successfully",beneficiary});

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

        const photoUrl = `http://localhost:8008/${beneficiary.photo}`;
        return res.status(200).json({photo:photoUrl});
        
    } catch (error) {
        res.status(500).json({ error: "Error retrieving photo" });
    }
}

controller.uploadDocument = async(req,res,next)=>{
    try {
        const {identifier} = req.params;
        const beneficiary = await Beneficiary.findById(identifier);
        if(!beneficiary){
            return res.status(404).json({error:"Beneficiary not found"});
        }

        const folderName = `beneficiaries/${sanitizeName(beneficiary.name)}/documents`;

        if(!req.files || req.files.length === 0){
            return res.status(400).json({error:"No file was uploaded"});
        }

        const uploadedFiles = [];

        for (const file of req.files){

            const ext = path.extname(file.originalname);
            const baseName = path.basename(file.originalname, ext);
            const fileName = `${folderName}/${baseName}${ext}`;
            
            const remoteFile = bucket.file(fileName);
            await remoteFile.save(file.buffer, {
                metadata: {
                    contentType: file.mimetype
                }
            });

            await remoteFile.makePublic();

            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

            const fileRecord = {
                name: `${baseName}${ext}`,
                url: publicUrl,
                path: fileName,
                date: new Date()
            };
            uploadedFiles.push(fileRecord);
            beneficiary.files.push(fileRecord);
        }

        await beneficiary.save();
        
                
        
        return res.status(200).json({message:"Document uploaded successfully",newFiles:beneficiary.files});



    } catch (error) {
        res.status(500).json({ error });
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

controller.getBeneficiariesForCSV = async(req,res,next)=>{
    try {
        const beneficiaries = await Beneficiary.find({ 'active.value': true }, 'name dui age').lean();
        res.status(200).json({beneficiaries});
    } catch (error) {
        next(error);
    }
}


controller.deleteDocument = async (req,res,next)=>{
    try {
        const {identifier} = req.params;
        
        let {fileName} = req.body;
        
        

        const beneficiary = await Beneficiary.findById(identifier);
        if(!beneficiary){
            return res.status(404).json({error:"Beneficiary not found"});
        }

        const filePath = beneficiary.files.find(file=>file.name === fileName);
        if(!filePath){
            return res.status(404).json({error:"File not found"});
        }

        const file = bucket.file(filePath.path);
        await file.delete();

        beneficiary.files = beneficiary.files.filter(file => file.name !== fileName);
        await beneficiary.save();

        return res.status(200).json({ 
            message: "Document deleted successfully", 
            newFiles: beneficiary.files 
        });
    } catch (error) {
        
        next(error);
    }
}

controller.generateCSV = async(req,res,next)=>{
    try {
        

        const {duiList=[],getAll="1"} = req.body;
        let data=[{}];
        
        
        
         if(String(getAll)==="1") {
            
            
            data = await Beneficiary.find({ 'active.value': true })
        }
        else{
            
            data = await Promise.all(
                duiList.map(async (dui) => {
                    const beneficiary = await Beneficiary.findOne({dui:dui,'active.value':true});
                    
                    return beneficiary;
                })
            );

            
        }


        const fields = [
            {label: "Nombre",value:"name"},
            {label:"DUI", value:"dui"},
            {label:"Edad", value:"age"},
            {label:"Sexo", value:"gender"},
            {label:"Telefono", value:"phone_number"}
        ];

        const parser = new AsyncParser({fields});
        const csvStream = parser.parse(data);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=beneficiarios.csv');
        csvStream.pipe(res);
        
//return res.status(200).json({message:"CSV generated successfully"});
    
    } catch (error) {
        
        
        
        res.status(500).json({ error
});

    }
}

module.exports = controller;