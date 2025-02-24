const debug = require('debug')('app:authMiddleware');
const {verifyToken}= require("../utils/jwt.tools.js");
//Import user model
const superUser = require("../models/superUser.model.js")
const { getPermissions } = require("../data/roles.data.js")


const middlewares= {};
const PREFIX = "Beares";

middlewares.authentication = async (req,res,next) =>{
    try {
        
        //Verify authorization header
        const {authorization} = req.headers;
        if(!authorization){
            return res.status(401).json({error:"Authorization header is required"});
        }


        //Verify token
        const [prefix,token] = authorization.split(" ");

        if(prefix !== PREFIX){
            return res.status(401).json({error:"User not authenticated"});
        }
        if(!token){
            return res.status(401).json({error:"User not authenticated"});
        }

        const payload = await verifyToken(token);
        if(!payload){
            return res.status(401).json({error:"User not authenticated"});
        }

        const userId = payload['sub'];

        //Verify user
        let user = await superUser.findById(userId);
        if(!user){
            return res.status(401).json({error:"User not authenticated"});
        }
        //Compare token with saved token
        const isTokenValid = user.tokens.includes(token);
        if(!isTokenValid){
            return res.status(401).json({error:"User not authenticated"});
        }
        //Modify request object
        req.user = user;
        req.token = token;
        req.rol = user.role;

        next();
    } catch (error) {
        next(error);

    }

}


middlewares.authorization = (requiredPermission) =>{
    return (req,res,next)=>{
        const {user} = req;
        const userRole = user.role;
        const userPermissions = getPermissions(userRole);
        
        if ( userPermissions.includes(requiredPermission)){
            next();
        }

        return res.status(403).json({error:"User not authorized"});
        
}
}
module.exports = middlewares;