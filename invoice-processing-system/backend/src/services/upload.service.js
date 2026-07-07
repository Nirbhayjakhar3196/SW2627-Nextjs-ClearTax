const UploadBatch = require('../models/UploadBatch')

const createUpload = async(file) => {

    const uploadBatch = await  UploadBatch.create({

        fileName : file.filename,

        originalFileName : file.originalname,

        status : "PENDING",

        totalRows : 0,

        processedRows : 0,

        successfulRows : 0,
        
        failedRows : 0,
    })

    return uploadBatch;

}

module.exports = {
    createUpload
}