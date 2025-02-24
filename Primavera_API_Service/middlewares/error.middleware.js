
module.exports = ((err,req,res,next)=>{
    const status = err.status || 500;
    console.error(err.message);

    return res.status(status).json({
        error:err.message
    });
})