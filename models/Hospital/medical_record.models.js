import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema({
    numberOfPatient:{
       type:number,
       required:true
    },
})

export const MedicalRecord = mongoose.model('MedicalRecord',medicalRecordSchema)