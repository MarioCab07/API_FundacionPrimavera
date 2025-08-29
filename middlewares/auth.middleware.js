const debug = require('debug')('app:authMiddleware');
const {verifyToken}= require("../utils/jwt.tools.js");
//Import user model
const SuperUser = require("../models/superUser.model.js")
const User = require("../models/user.model.js")
const { getPermissions } = require("../data/roles.data.js")


const middlewares= {};


middlewares.authentication = async (req,res,next) =>{
    try {
        
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Missing access token" });

    
    const payload = await verifyToken(token);
    if (!payload) return res.status(401).json({ error: "Invalid or expired access token" });

    
    const userId = payload.sub || payload.id;
    let user = await SuperUser.findById(userId) || await User.findById(userId);
    if (!user) return res.status(401).json({ error: "User not found" });

    // 4) Adjunta info al request
    req.user = user;
    req.role = user.role;

        return next();
    } catch (error) {
        return next(error);

    }

}


middlewares.authorization = (requiredPermission) =>{
    return (req,res,next)=>{
        const {user} = req;
        const userRole = user.role;
        
        const userPermissions = getPermissions(userRole);
        
         if ( userPermissions.includes(requiredPermission) ){
             next();
         }else{
            return res.status(403).json({error:"User not authorized"});
         }
        

        
        
}
}
module.exports = middlewares;