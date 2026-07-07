const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadDir = path.resolve(__dirname, '../../uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, uploadDir);
    },

    filename : (req,file,cb) => {
        const safeName = file.originalname.replace(/\s+/g, '_');
        const uniqueName = `${Date.now()}-${safeName}`;
        cb(null, uniqueName);
    }
})


const fileFilter = (req , file, cb) => {
    const allowedTypes = [".csv"];
    const allowedMimeTypes = ['text/csv', 'application/vnd.ms-excel'];
    const extension = path.extname(file.originalname).toLowerCase();

    if(allowedTypes.includes(extension) || allowedMimeTypes.includes(file.mimetype)){
        cb(null, true);
    }
    else{
        cb(new Error("Only CSV files are allowed"), false);
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits:{
        fileSize : 5*1024*1024 // 5 MB
    }
})

module.exports = upload;