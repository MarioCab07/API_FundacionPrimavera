const superUser = require ('../models/superUser.model.js');

//const User = import()
const tools =  require( "../utils/jwt.tools.js")
const debug = require('debug')('app:server') ;

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
        debug("Error in superUserRegister", error);
        next(error);
    }
}

controller.Login = async(req,res,next)=>{

    try {
        const {username, password} = req.body;
        let isSuperUser = false;

        //Verify if is superUser
        let user = await superUser.findOne({username:username});

        if(!user){
            return res.status(404).json({error:"User not found"});
        }

        //Verify password
        if(!user.comparePassword(password)){
            return res.status(401).json({error:"Incorrect password"});
        }

        //Create Token
        const token = await tools.createToken(user._id);

        //Save Token
        //Check Tokens lifetime - max 5 tokens
        let _tokens = [...user.tokens]
        const _verifyPromises = _tokens.map(async (_t) => {
            const status = await tools.verifyToken(_t);
            return  status ? _t: null;
        });

        _tokens = (await Promise.all(_verifyPromises))
            .filter(_t =>_t)
            .slice(0,5);

        _tokens = [token,..._tokens];
        user.tokens = _tokens;
        
        await user.save();
        // Return Token

        return res.status(200).json({token});

        // if(!user){
            
        //     user = await User.findOne({username:username});
        //     if(!user){
        //         return res.status(404).json({error:"User not found"});
        //     }

        // }else{
        //     isSuperUser = true;
        // }

        

        // if(!isSuperUser){
            
        // }




    } catch (error) {
        
        debug("Error in superUserLogin", error);
        next(error);
    }
}



module.exports = controller;