const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { sanitizeName } = require("../utils/general.tools");
const debug = require('debug')('app:ben-middleware');

const storage = multer.diskStorage({
    destination : async function (req,file,cb){
        try {
            
            const basePath = path.join('uploads','inventory');
            await fs.ensureDir(basePath);
            cb(null,basePath);
        } catch (error) {
            cb(error,null);
        }
    },
    filename : function(req,file,cb){
        try {
            const name = sanitizeName(req.body.product);
            cb(null,name + path.extname(file.originalname));
        } catch (error) {
            cb(error,null);
        }

    }
});

const upload  = multer({
    storage: storage,
    fileFilter: function(req,file,cb){
        if(file.mimetype.startsWith('image/')){
            cb(null,true);
        }else{
            cb(new Error('Only image files are allowed!'),false);
        }
    }
})


module.exports = upload;