const uploadService = require('../services/upload.service');

const uploadFile = async (req, res) => {

    try {

        if(!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file was uploaded. Send a multipart form-data field named file.',
            });
        }

        const uploadBatch = await uploadService.createUpload(req, res);

        res.status(200).json({
            success: true,
            message: 'File uploaded and processed successfully.',
            uploadBatch: uploadBatch
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while processing the upload.',
            error: error.message
        });
    }

}

module.exports = {
    uploadFile
}