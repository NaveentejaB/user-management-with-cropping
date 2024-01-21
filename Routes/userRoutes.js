const express = require("express")
const multer = require("multer")
const user = require("../controllers/user")
const auth = require('../middlewares/auth')

const userRouter = express.Router()

const storage = multer.memoryStorage
const upload = multer({ storage: storage,
    fileFilter:(req, file, cb)=>{
        if(
            file.mimetype == 'image/jpeg' ||
            file.mimetype == 'image/jpg' ||
            file.mimetype == 'image/png' 
        ){
            cb(null, true);
        }
        else{
            cb(null, false);
            cb(new Error('Only jpeg,  jpg , and png Image allowed'))
        }
    } })

userRouter.post("/login",user.userLogin)

userRouter.post("/",auth.authenticate,auth.checkRole('user'),upload.single('profile_image'),user.userUpdate)

userRouter.get("/",auth.authenticate,auth.checkRole('user'),user.getUserDetails)

module.exports = userRouter