const User = require("../models/user_model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const multer = require("multer")
const sharp = require("sharp")
const validator = require("../utils/validationSchema")
const base64 = require('base64-js')


module.exports.userUpdate = async(req,res) => {
    console.log(req.body);
    const {user_name,profile_image} =  req.body
    const base64_input = profile_image.replace('data:image/png;base64,','')
    const binary_input = base64.toByteArray(base64_input)
    const compressed_img = await sharp(binary_input).resize({width:300, height:600 }).toFormat('webp',{quality:60}).toBuffer()
    const compressed_base64 = compressed_img.toString('base64')

	const id = jwt.decode(req.headers["authorization"]).id
    if(id === null)
        return res.redirect(403,`/user/login`).json({
            message : `please login to access this.`,
            error : true
        })
    const user = await User.findOne({_id:id})
    if(!user) //mostly impossible case ig
        return res.status(400).json({
            message : `please check your creditinals and login again.`,
            error : true
        })  
    const update_user = await User.findOneAndUpdate({_id:id},{
        user_name : user_name,
        update_req:true,
        update_status:false,
        user_image : {
            data : compressed_base64,
            base64img: compressed_base64,
            content_type : 'image/webp'
        }
    })
    return res.status(200).json({
        message : `updated user details.`,
        error : false
    })  
}

module.exports.getUserDetails  = async(req,res) => {
    const id = jwt.decode(req.headers["authorization"]).id
    if(id === null)
        return res.redirect(403,`/user/login`).json({
            message : `please login to access this.`,
            error : true
        })
    const user = await User.findOne({_id:id})
    return res.status(200).json({
        user : user,
        message : 'fetched personal data',
        error : false
    })
}

module.exports.userLogin = async(req,res) => {
    const { error } = validator.user_validation(req.body);
		if (error)
			return res.status(400).json({ 
                error: true, 
                message: error.details[0].message 
            })
    const {user_id, user_password} = req.body
    const user = await User.findOne({user_id:user_id})
    if(!user){
        return res.status(401).json({
            message : `user with id : ${user_id} does't exist.`,
            error : true
        })
    }
    const verifiedPassword = await bcrypt.compare(
        user_password,
        user.user_password
    )
    if (!verifiedPassword)
        return res.redirect(401,"/user/login").json({ 
            error: true, 
            message: "Invalid  password" 
        })
    
    const payload = { id:user._id , role :"user"}

    const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_PRIVATE_KEY,
        { expiresIn: "90m" }
    )
    console.log(accessToken);	
    return res.status(200).json({
        redirectUrl :"/user/",
        accessToken : accessToken,
        error: false,
        message: "Logged in sucessfully",
    })
}


