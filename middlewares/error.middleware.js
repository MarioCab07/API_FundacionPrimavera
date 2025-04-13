
module.exports = ((err,req,res,next)=>{
    const status = err.status || 500;
    console.error(err.message);
    if (res.headersSent) {
        return next(err);
      }
    return res.status(status).json({
        error:err.message
    });
})