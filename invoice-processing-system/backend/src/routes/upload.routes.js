
const express = require('express')
const upload = require('../config/multer')
const {uploadFile} = require('../controllers/upload.controller')

const router = express.Router();

router.post('/' , upload.single("file") , uploadController)

module.exports = router;