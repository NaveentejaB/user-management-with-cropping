const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
    admin_id :{
        type:Number,
        requried:true,
        unique : true
    },
    admin_password : {
        type:String,
        required:true
    },
    role : {
        type:String,
        default:"admin"
    }
})

const Admin = mongoose.model("Admin",adminSchema)

module.exports = Admin