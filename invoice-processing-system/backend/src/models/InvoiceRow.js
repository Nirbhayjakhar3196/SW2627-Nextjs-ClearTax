const mongoose = require("mongoose")

const invoiceRow = new mongoose.Schema({

    bathchId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UploadBatch",
        required:true
    },
    invoiceNumber:{
        type:String,
        required:true,
        trim:true
    },
    vendor:{
        type:String,
        trim:true,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    processingStatus:{
        type:String,
        enum:["pending", "successfully" , "Failed"],
        default: "Pending"
    },
    matchStatus:{
        type:String,
        enum:["Matched" , "Mismatched", "Pending"],
        default: "Pending"
    },
    errorMessage:{
        type:String,
        default:""
    }
},{
    timestamps:true
})

module.exports = mongoose.model("Invoice" , invoiceRow)