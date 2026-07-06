const express = require('express');
const uploadRoute = require('../src/routes/upload.routes')

const app = express();

app.use(express.json());

app.use('/api/uploads' ,uploadRoute )

app.get('/health' , (req,res) => {

    res.json({
        message: 'Server is healthy'
    })
})

app.use((err, req, res, next) => {
    if (err) {
        const statusCode = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;

        return res.status(statusCode).json({
            success: false,
            message: err.message || 'Upload failed',
        });
    }

    next();
});

module.exports = app;