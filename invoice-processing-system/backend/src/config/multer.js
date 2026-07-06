const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({

    destination: (req,res,cb) => {
        cb(null ,'uploads/')
    },

    filename : (req,res,cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null,uniqueName)
    }
})


const fileFilter = (req , res , cb) => {

    const allowedTypes = [".csv"];
    const extension = path.extname(file.originalname).toLowerCase();

    if(allowedTypes.includes(extension)){
        cb(null , true);
    }
    else{
        cb(new Error("Only csv file Allowed") , false)
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits:{
        fileSize : 5*1024*1024 // 5 MB
    }
})

module.exports = upload