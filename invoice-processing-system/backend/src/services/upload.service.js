const UploadBatch = require('../models/UploadBatch')

const createUpload = async(req , res) => {

    const uploadBatch = new UploadBatch.create({

        filename : file.filename,

        originalFileName : file.originalname,

        status : "Pending",

        TotalRows : 0,

        ProcessedRows : 0,

        successfulRows : 0,
        
        failedRows : 0,
    })

    return uploadBatch;

}

module.exports = {
    createUpload
}