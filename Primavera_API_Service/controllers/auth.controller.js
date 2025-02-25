const superUser = require ('../models/superUser.model.js');
const User = require ('../models/user.model.js');
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

        

        await newSuperUser.save();

        return res.status(201).json({message:"SuperUser created successfully"});


    } catch (error) {
        debug("Error in superUserRegister", error);
        next(error);
    }
}

controller.Login = async(req,res,next)=>{

    try {
        //TODO: Add rememberMe
        const {username, password} = req.body;
        

        //Verify if is User
        let user = await User.findOne({username:username});
        debug(username)

        if(!user){
            //Verify if is SuperUser
            user = await superUser.findOne({username:username});
            if(!user){
                return res.status(404).json({error:"User not found"});
            }
            
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
        
            // res.cookie("token", token, {
            //     httpOnly: true,
            //     secure: process.env.NODE_ENV === "production",
            //     maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días o 15 min
            // });
        
        

       debug("Creacion usuartio");
        
        await user.save();
        // Return Token

        return res.status(200).json({token});

        




    } catch (error) {
        
        debug("Error in superUserLogin", error);
        
    }
}

controller.userRegister = async(req,res,next)=>{
    try {
        const {name,dui,phone_number, role} = req.body;
        const user =  await User.findOne({dui:dui});
        if(user){
            return res.status(409).json({error:"User already exists"});
        }

        const newUser = new User({
            name:name,
            phone_number:phone_number,
            dui:dui,
            role:role,
        })
        newUser.encryptPassword();
        const password = newUser.desencryptPassword();
        newUser.generateUser();

        await newUser.save();

        return res.status(201).json({message:"User created successfully",
            username:newUser.username,
            password:password
        });




    } catch (error) {
        debug("Error in UserRegister", error);
        
    }
} 

controller.updateUser = async(req,res,next)=>{
    try {
        const {name,dui,phone_number,role}=req.body;
        const {id} = req.params;
        let user = await User.findById(id);
        if(!user){
            return res.status(404).json({error:"User not found"});
        }
        

        user.name = name;
        user.dui = dui;
        user.phone_number = phone_number;
        rol ? user.role = rol : user.role = user.role;

        
        user.generateUser();

        await user.save();

        return res.status(200).json({message:"User updated successfully",new_User:user.username});


      } catch (error) {
        debug("Error in updateUser", error);
    }
}

controller.getAllUsers = async(req,res,next)=>{
    try {
        let Users = await User.find({},{ tokens: 0});
        Users = Users.map((user) => {
            return {
                id: user._id,
                name: user.name,
                dui: user.dui,
                phone_number: user.phone_number,
                role: user.role,
                username: user.username,
                password : user.desencryptPassword()
            }
        });
        
        return res.status(200).json({Users});

    } catch (error) {
        debug("Error in getAllUsers", error);

    }
}

controller.deleteUser = async(req,res,next)=>{
    try {
        const {id} = req.params;
        let user =  await User.findByIdAndDelete(id);
        if(!user){
            return res.status(404).json({error:"User not found"});
        }

        return res.status(200).json({message:"User deleted successfully"});
    } catch (error) {
        
    }
}


module.exports = controller;