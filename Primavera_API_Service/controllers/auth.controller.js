const superUser = require ('../models/superUser.model.js');
const User = require ('../models/user.model.js');
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
        
        if(typeof username !== "string" || typeof password !== "string"){
            return res.status(400).json({error:"Invalid data"});
        }

        //Verify if is User
        let user = await User.findOne({username:username});
        

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
        const token = await tools.createToken(user._id,user.role);

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
        
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Strict",
                maxAge:  24 * 60 * 60 * 1000 // 1 day
            });
        
        

       
        
        await user.save();
        // Return Token

        return res.status(200).json({name:user.name,username:user.username,role:user.role});

        




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
        const {identifier} = req.params;
        let user =  await User.findOneAndDelete({$or:[{dui:identifier},{_id:identifier}]});
        if(!user){
            return res.status(404).json({error:"User not found"});
        }

        return res.status(200).json({message:"User deleted successfully"});
    } catch (error) {
        
    }
}

controller.whoAmi = async(req,res,next)=>{
    try {
        const user = req.user;
        if(!user) return res.status(401).json({error:"User not authenticated"});
        return res.status(200).json({name:user.name,username:user.username,role:user.role});
    } catch (error) {
        
    }
}

controller.logout = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        const payload = await tools.verifyToken(token);
        if (!payload) {
            return res.status(401).json({ error: "Invalid token" });
        }

        const userId = payload['sub'];

        // Find the user and remove the token
        let user = await User.findById(userId);
        if (!user) {
            user = await superUser.findById(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
        }

        user.tokens = user.tokens.filter((t) => t !== token);
        await user.save();

        // Clear the cookie
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
        });

        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        debug("Error in logout", error);
        next(error);
    }
};

module.exports = controller;