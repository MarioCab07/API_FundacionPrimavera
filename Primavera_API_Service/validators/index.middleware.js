const { validationResult } = require('express-validator');

module.exports = (req,res,next)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array().map(_e =>(
                {
                    field:_e.param,
                    message:_e.msg
                }
            ))
        });
    }

    next();

}