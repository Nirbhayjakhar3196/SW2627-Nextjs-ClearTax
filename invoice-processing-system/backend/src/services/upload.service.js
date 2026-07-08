const UploadBatch = require('../models/UploadBatch')
const parseCSV = require('../utils/csvParser');

const createUpload = async(file) => {

    const rows = await parseCSV(file.path);

    const uploadBatch = await  UploadBatch.create({

        fileName : file.filename,

        originalFileName : file.originalname,

        status : "PENDING",

        totalRows : rows.length,

        processedRows : 0,

        successfulRows : 0,
        
        failedRows : 0,
    })

    return uploadBatch;

}

module.exports = {
    createUpload
}