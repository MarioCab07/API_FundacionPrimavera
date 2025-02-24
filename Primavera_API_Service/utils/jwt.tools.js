let SignJWT, jwtVerify;

(async () => {
  const jose = await import('jose');
  SignJWT = jose.SignJWT;
  jwtVerify = jose.jwtVerify;
})();



const secret = new TextEncoder().encode(process.env.SECRET_TOKEN);
const expTime = process.env.TOKEN_EXP_TIME;
const tools = {};

tools.createToken = async (id) => {
   return await new SignJWT()
        .setProtectedHeader({alg: 'HS256'})
        .setSubject(id)
        .setExpirationTime(expTime)
        .setIssuedAt()
        .sign(secret)
}

tools.verifyToken = async (token) => {
    try {
        return (await jwtVerify(token, secret)).payload;

    } catch (error) {
        return false;
    }
}
module.exports =  tools;