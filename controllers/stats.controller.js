const Beneficiary = require('../models/beneficiary.model');
const debug = require('debug')('app:statsController');

const controller = {};

controller.generalStats = async(req,res,next)=>{
    try {
        const totalBeneficiaries = await Beneficiary.countDocuments({"active.value":true});
        const totalMen = await Beneficiary.countDocuments({gender:"Masculino","active.value":true});
        const totalWomen = await Beneficiary.countDocuments({gender:"Femenino","active.value":true});
        const totalPensioners = await Beneficiary.countDocuments({pension:true,"active.value":true});
    
        return res.status(200).json({TotalBeneficiares:totalBeneficiaries,TotalMen:totalMen,TotalWomen:totalWomen,TotalPensioners:totalPensioners});
    } catch (error) {
        
    }
}

controller.ageStats = async(req,res,next)=>{
    try {

        
        let {age,greater = 1} = req.query;
        age = parseInt(age);
        greater = parseInt(greater);
        const filter = {"active.value":true};
        
        if(greater===1){
            

            filter.age = {$gt:age};
        }else{
            
            filter.age = {$lt:age};
        }
        
        const beneficiaries = await Beneficiary.countDocuments(filter);
        return res.status(200).json({TotalBeneficiaries:beneficiaries});
    } catch (error) {
        
    }
}

controller.phoneStats = async(req,res,next)=>{
    try {
        
        const companyStats = await Beneficiary.aggregate([{
            $match: {"active.value":true}
        },
        {
            $group:{
                _id:"$phone_company",
                total:{ $sum:1}
            }
        }
            ]);
        
        const whatsappStats = await Beneficiary.countDocuments({whatsapp:true,"active.value":true});


        return res.status(200).json({CompanyStats:companyStats,WhatsappStats:whatsappStats});
    } catch (error) {
        
    }
}

controller.houseStats = async(req,res,next)=>{
    try {
        const houseType = await Beneficiary.aggregate([{
            $match: {"active.value":true}
        },{
            $group:{
                _id:"$house_type",
                total:{$sum:1}
            }
        }]);
        return res.status(200).json({HouseTypeStats:houseType});
    } catch (error) {
        
    }
}

controller.incomeStats = async(req,res,next)=>{
    try {
        const incomeLevel = await Beneficiary.aggregate([{
            $match:{"active.value":true}
        },
        {
            $group:{
                _id:"$income_level",
                total:{$sum:1}
            }
        }])

        return res.status(200).json({IncomeLevelStats:incomeLevel});
    } catch (error) {
        
    }
}

module.exports = controller;