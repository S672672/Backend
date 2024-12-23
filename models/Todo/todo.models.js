import mongoose from "mongoose";
const todoSchema =new mongoose.Schema( {
    name:{
        type:String,
        required:true
    },
    complete:{
        type:Boolean,
        default:false
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        reference:'User'
    },
    subTodos:{
        type:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'SubTodo'
        }],

    }
},{timestamps:true})

export const Todo = mongoose.model('Todo',todoSchema)