const mongoose = require("mongoose");

const uploadBatchSchema = new mongoose.schema({

    fileName:{
        type:String,
        required:true,
    },
    originalFileName:{
        type:String,
        required:true,
    },
    totalRows:{
        type:Number,
        required:true,
        default:0
    },
    processedRows:{
        type:Number,
        default:0
    },
    successfulRows:{
        type:Number,
        default:0
    },
    failedRows:{
        type:Number,
        default:0
    },
    progress:{
        type:Number,
        default:0
    },

    status:{
        type:String,
        enum:["pending" , "processing" , "Completed" , "Failed"],
        default:0
    },
},{
    timestamps: true
})

module.exports = mongoose.model("UploadBatch" , uploadBatchSchema)