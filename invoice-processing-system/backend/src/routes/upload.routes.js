
const express = require('express')
const upload = require('../config/multer')

const router = express.Router();

const uploadController = (req , res) => {

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'No file was uploaded. Send a multipart form-data field named file.',
        });
    }

    res.status(200).json({
        success : true,
        messsage: "File Received Successfully",
        file : req.file
    })

}

router.post('/' , upload.single("file") , uploadController)

module.exports = router;