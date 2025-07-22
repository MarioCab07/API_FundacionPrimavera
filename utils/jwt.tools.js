let SignJWT, jwtVerify;

(async () => {
  const jose = await import('jose');
  SignJWT = jose.SignJWT;
  jwtVerify = jose.jwtVerify;
})();

const crypto = require('crypto');



const ACCESS_SECRET = new TextEncoder().encode(process.env.SECRET_TOKEN);
const REFRESH_SECRET = new TextEncoder().encode(process.env.REFRESH_TOKEN);
const expTimeShort = process.env.TOKEN_EXP_TIME_SHORT;
const expTimeLong = process.env.TOKEN_EXP_TIME_LONG;
const accessTTL = process.env.ACCESS_TTL;
const tools = {};

tools.createToken = async (id,role) => {
    
   return await new SignJWT({id,role})
        .setProtectedHeader({alg: 'HS256'})
        .setSubject(id)
        .setExpirationTime(accessTTL)
        .setIssuedAt()
        .sign(ACCESS_SECRET)
}

tools.verifyToken = async (token) => {
    try {
        return (await jwtVerify(token, ACCESS_SECRET)).payload;

    } catch (error) {
        return false;
    }
}


tools.signRefresh = async (id, rememberMe=false) => {
    const exp = rememberMe ? expTimeLong : expTimeShort;
    return new SignJWT({id,rememberMe})
        .setProtectedHeader({alg: 'HS256'})
        .setSubject(id)
        .setExpirationTime(exp)
        .setIssuedAt()
        .sign(REFRESH_SECRET)

}

tools.verifyRefresh = async (token) => {
    try{
        return (await jwtVerify(token,REFRESH_SECRET)).payload;
    }catch(error){
        return false;
    }

}

tools.hash = (value)=>{
    return crypto.createHash('sha256').update(value).digest('hex');
}



module.exports =  tools;