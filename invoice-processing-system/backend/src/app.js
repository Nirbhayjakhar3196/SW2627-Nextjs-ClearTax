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

module.exports = app;