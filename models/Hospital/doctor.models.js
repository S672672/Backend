import mongoose from "mongoose";

const hospitalHoursSchema = new mongoose.schema({
    name:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Hospital',
        required:true
    },
    workHours:{
        type:String,
        required:true
    }
})

const doctorSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    salary:{
        type:String,
        required:true
    },
    qualifications:{
        type:String,
        required:true
    },
    experience:{
        type:Number,
        required:true,
        default:0
    },
    worksInHospitals:[hospitalHoursSchema],
},{timestamps:true})

export const Doctor = mongoose.model('Doctor',doctorSchema)