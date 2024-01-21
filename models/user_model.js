const { bool } = require("joi")
const mongoose = require("mongoose")

const imageSchema = new mongoose.Schema({
    data : Buffer,
    base64img : String,
    content_type : String
})

const userSchema = new mongoose.Schema({
    user_id :{
        type:Number,
        required:true,
        unique:true
    },
    user_name:{
        type:String,
        required:true
    },
    user_password : {
        type:String,
        required:true
    },
    user_image : imageSchema ,
    update_req : {
        type : Boolean,
        default : false
    },
    update_status:{
        type:Boolean,
        default : false
    },
    role : {
        type:String,
        default:"user"
    }
})

const User = mongoose.model("User",userSchema)

module.exports = User