import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
    username : {
        type:String,
        required : true,
        unique:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    },
},{timeStamps:true})

export const User = mongoose.model('User',userSchema)