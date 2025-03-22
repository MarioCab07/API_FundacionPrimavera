const Petition = require('../models/petition.model');
const debug = require('debug')('app:petitionController');

const controller = {};

controller.getPetitions = async(req,res,next)=>{
    try {
        const {status = 'pending'} = req.query;
        let {page =1, limit = 6 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const petitions = await Petition.find({status:status}).populate({path:'userId',select:'name username dui'}).populate({path:'volunteerId',select:'name username dui'}).skip((page-1)*limit)
        .limit(parseInt(limit));
        return res.status(200).json(petitions);
    } catch (error) {
        
    }
}

controller.resolvePetition = async(req,res,next)=>{
    try {
        //action : [accepted,rejected]
        //close : [true,false]
        const{identifier} = req.params;
        const {action,close} = req.body;
        const petition = await Petition.findById(identifier)
        
        

        if(!petition){
            return res.status(404).json({error:"Petition not found"});
        }
        if(petition.status !== 'pending'){
            return res.status(400).json({error:"Petition already resolved"});
        }
        petition.status = action;
        await petition.save();

        if(close == "true"){
            
           await Petition.findByIdAndDelete(identifier);
           return res.status(200).json({message:"Petition resolved and deleted successfully"});
        }

        return res.status(200).json({message:"Petition resolved successfully"});

    } catch (error) {
        debug(error)
    }
}

controller.deletePetition = async(req,res,next)=>{
    try {
        const{identifier} = req.params;
        const petition = await Petition.findByIdAndDelete(identifier);
        if(!petition){
            return res.status(404).json({error:"Petition not found"});
        }
        return res.status(200).json({message:"Petition deleted successfully"});
    } catch (error) {
        
    }
}

controller.reopenPetition = async(req,res,next)=>{
    try {
        const {identifier} = req.params;
        const petition = await Petition.findById(identifier);
        if(!petition){
            return res.status(404).json({error:"Petition not found"});
        }
        petition.status = 'pending';
        await petition.save();
        return res.status(200).json({message:"Petition reopened successfully"});
    } catch (error) {
        
    }
}





module.exports = controller;