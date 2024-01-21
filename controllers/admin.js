const sharp = require('sharp')
const bcrypt = require("bcrypt")
const Admin = require("../models/admin_model")
const User = require("../models/user_model")
const validator = require('../utils/validationSchema')


module.exports.getTwoUsers = async(req,res) => {
    const users = await User.find({}).limit(2)
    const ids = users.map((user)=>{
        return user.user_id
    })
    res.status(200).json({
        message : 'fetched two users.',
        user_ids : ids,
        error : false
    })
}

module.exports.denyUser = async(req,res) => {
    const {user_id} = req.body
    const user = await User.findOne({user_id:user_id})
    if(!user)
        return res.status(400).json({
            message : 'user doesn`t exist',
            error : true
        })
    const buffer = await sharp('public/default_image.jpg').toBuffer()
    const bufferImg =await sharp(buffer).toFormat('webp',{ quality: 60 }).toBuffer()
    const base64_image = bufferImg.toString('base64')
    const update_user = await User.findOneAndUpdate({user_id:user_id},{
        update_req: false ,
        update_status:false,
        user_name : "-",
        user_image : {
            data : base64_image,
            base64img : base64_image,
            content_type : 'image/webp'
        }
    })
    res.status(200).json({
        message : 'user changes denied.',
        error : false
    })
}

module.exports.approveUser = async(req,res) => {
    const {user_id} = req.body
    const user = await User.findOne({user_id:user_id})
    if(!user)
        return res.status(400).json({
            message : 'user doesn`t exist',
            error : true
        })
    const update_user = await User.findOneAndUpdate({user_id:user_id},{update_status:true,update_req:false})
    res.status(200).json({
        message : 'approved the user.',
        error : false
    })
}
module.exports.getAllUsers = async(req,res) => {
    const users = await User.find({})
    res.status(200).json({
        users : users,
        message : 'fetch all users',
        error : false
    })
}


module.exports.addUser = async(req,res) => {
    const { error } =validator.user_validation(req.body);
    console.log(error);
		if (error)
			return res.status(400).json({ 
                error: true, 
                message: error.details[0].message
            })
    const {user_id,user_password} = req.body
    const buffer = await sharp('public/default_image.jpg').toBuffer()
    const webp_image =await sharp(buffer).toFormat('webp',{ quality: 60 }).toBuffer()
    const base64_image = webp_image.toString('base64')
    const user = await User.findOne({user_id:user_id})
    if(user)
        return res.status(400).json({
            message : 'user already exists',
            error : true
        })
    const salt = await bcrypt.genSalt(Number(10))
    const hashPassword = await bcrypt.hash(user_password, salt)
    await new User({
        user_id,
        user_password : hashPassword,
        user_name : "-",
        user_image : {
            data : base64_image,
            base64img : base64_image,
            content_type : 'image/webp'
        }
    }).save()
    return res.status(201).json({
        message : 'new user added',
        error : false
    })
    
}

module.exports.deleteUser = async(req,res) => {
    const {user_id} = req.body
    const user = await User.findOne({user_id:user_id})
    if(!user)
        return res.status(400).json({
            message : 'user doesn`t exist',
            error : true
        })
    const delete_user = await User.findOneAndDelete({user_id:user_id})
    return res.status(200).json({
        message : 'deleted the user',
        error : false
    })
}


