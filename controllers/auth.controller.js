const superUser = require ('../models/superUser.model.js');
const User = require ('../models/user.model.js');
const tools =  require( "../utils/jwt.tools.js")
const debug = require('debug')('app:server') ;

const ONE_DAY = 24 * 60 * 60 * 1000;
const SEVEN_DAYS = 7 * ONE_DAY;
const toBool = (v) =>
  v === true || v === 'true' || v === 'on' || v === 1 || v === '1';

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
        
        next(error);
    }
}

controller.login = async(req,res,next)=>{

    try {
        //TODO: Add rememberMe
        const {username, password} = req.body;
        const remember = toBool(req.body.rememberMe);
        
        
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
        const accessToken = await tools.createToken(user._id,user.role);
        const refreshToken = await tools.signRefresh(user._id,remember);

        const hashedRT = tools.hash(refreshToken);
        user.tokens = [hashedRT,...(user.tokens || [])].slice(0,5); // Keep only the last 5 tokens
        
        await user.save();

        res.cookie('rt',refreshToken,{
            httpOnly : true,
            secure: process.env.NODE_ENV === "production",
            ...(remember && { maxAge: SEVEN_DAYS }),
            path: '/api/v1/auth'
        })
        
        return res.status(200).json({
      user: { id: user._id, name: user.name, role: user.role },
      accessToken
    });

    } catch (error) {
       next(error);
        
    }
}

controller.refresh = async(req,res,next)=>{
    try{   
        const oldToken = req.cookies.rt;
        if(!oldToken) {
            
            return res.status(401).json({error:"No token provided"});}

        const payload = await tools.verifyRefresh(oldToken);
        if(!payload) {
            
            return res.status(401).json({error:"Invalid refresh"});}

        const {id,rememberMe} = payload;
        const remember = toBool(rememberMe);
        
        const oldHash = tools.hash(oldToken);
        

        const user = await User.findById(id) ||
                      await superUser.findById(id);
                    

        if (!user) {
      
      await User.updateOne({ _id: id }, { $set: { tokens: [] } });
      await superUser.updateOne({ _id: id }, { $set: { tokens: [] } });
      
      return res.status(401).json({ error: "Token obsolete" });
    }


    const accessToken = await tools.createToken(user._id, user.role);
    const newRt = await tools.signRefresh(user._id, remember);
    const newHash = tools.hash(newRt);

    await user.updateOne(
      { $set: { "tokens.$[match]": newHash } },
      { arrayFilters: [{ match: oldHash }], runValidators: false }
    );

     res.cookie("rt", newRt, {
      httpOnly: true,                   
      secure: process.env.NODE_ENV === "production",
      path: "/api/v1/auth",
      ...(remember && { maxAge: SEVEN_DAYS }),
    });

     return res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
      accessToken,
    });

    }catch(error){

        next(error);
    }
}


controller.userRegister = async(req,res,next)=>{
    try {
        const {name,dui,phone_number, role, email} = req.body;
        const user =  await User.findOne({dui:dui});
        if(user){
            return res.status(409).json({error:"User already exists"});
        }

        const newUser = new User({
            name:name,
            phone_number:phone_number,
            dui:dui,
            role:role,
            email:email
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
        next(error);
        
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
        role ? user.role = role: user.role = user.role;

        
        user.generateUser();

        await user.save();

        return res.status(200).json({message:"User updated successfully",new_User:user.username});


      } catch (error) {
        next(error);
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
        next(error);

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
        next(error);
    }
}

controller.whoAmi = async(req,res,next)=>{
    try {
        const user = req.user;
        if(!user) return res.status(401).json({error:"User not authenticated"});
        return res.status(200).json({name:user.name,username:user.username,role:user.role});
    } catch (error) {
        next(error);
    }
}

controller.logout = async (req, res, next) => {
    try {
         const rt = req.cookies?.rt;

         res.clearCookie('rt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      path: '/api/v1/auth', 
    });

        if (!rt) return res.sendStatus(204);

        const payload = await tools.verifyRefresh(rt);
        if (payload) {
            const id = payload.sub || payload.id;
            const hashed = tools.hash(rt);
            let user =
        (await superUser.findById(id)) ||
        (await User.findById(id));

        if(user?.tokens){
            user.tokens = user.tokens.filter(t => t !== hashed);
            await user.save();
        }
        }

        return res.sendStatus(204);

    } catch (error) {
        
        next(error);
    }
};

module.exports = controller;