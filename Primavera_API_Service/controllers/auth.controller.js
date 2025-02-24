const superUser = require('../models/superUser.model');
const debuug = require('debug')('app:authController'); 
const controller = {};

//SuperUser Register
controller.superUserRegister = async(req,res,next)=>{
    try {
        
        //Get info
        const {name, username ,email, password} = req.body;
        //Verify info
        const user = await superUser.findOne({username:username});

        if(user){
            return res.status(409).json({error:"Username already exists"});
        }

        const newSuperUser = new superUser({
            username:username,
            email:email,
            password:password,
            name:name
        });

        newSuperUser.salt = newSuperUser.makeSalt();
        newSuperUser.hashedPassword = newSuperUser.encryptPassword(password);

        await newSuperUser.save();

        return res.status(201).json({message:"SuperUser created successfully"});


    } catch (error) {
        console.error(error);
        return res.status(500).json({error:"Internal Server Error"});
    }
}



module.exports = controller;