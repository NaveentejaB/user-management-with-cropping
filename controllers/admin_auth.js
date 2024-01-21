const Admin = require("../models/admin_model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const validator = require("../utils/validationSchema")

module.exports.register = async(req,res) =>{
    const { error } = validator.admin_validation(req.body);
    console.log(error);
		if (error)
			return res.status(400).json({ 
                error: true, 
                message: error.details[0].message
            })

    const {admin_id,admin_password} = req.body            
    const admin = await Admin.findOne({admin_id:admin_id})
    if(admin){
        return res.status(400).json({
                message : `admin_id are already exists.`,
                error : true    
            })
    }  
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(admin_password, salt)
    await new Admin({
        admin_id,
        admin_password : hashPassword
    }).save()
    return res.status(201).json({
            message : `admin account created successfully.`,
            error : false
        })
}

module.exports.login = async(req,res) => {
    console.log(req.body);
    const { error } = validator.admin_validation(req.body);
		if (error)
			return res.status(400).json({ 
                error: true, 
                message: error.details[0].message 
            })
    console.log(req.body);
    const {admin_id, admin_password} = req.body
    const admin = await Admin.findOne({admin_id:admin_id})
    if(!admin){
        return res.status(401).json({
            message : `admin with id : ${admin_id} does't exist.`,
            error : true
        })
    }
    const verifiedPassword = await bcrypt.compare(
        admin_password,
        admin.admin_password
    )
    if (!verifiedPassword)
        return res.redirect(401,"/admin/login").json({ 
            error: true, 
            message: "Invalid  password" 
        })
    
    const payload = { id:admin._id , role :"admin"}

    const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_PRIVATE_KEY,
        { expiresIn: "90m" }
    )	
    return res.status(200).json({
        redirectUrl :"/admin/",
        accessToken : accessToken,
        error: false,
        message: "Logged in sucessfully",
    })
}