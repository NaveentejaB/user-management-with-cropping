const express = require("express")
const admin = require("../controllers/admin")
const adminAuth = require("../controllers/admin_auth")
const auth = require('../middlewares/auth')

const adminRoutes = express.Router()

adminRoutes.post('/register',adminAuth.register)

adminRoutes.post('/login',adminAuth.login)

adminRoutes.get('/',auth.authenticate,auth.checkRole('admin'),admin.getTwoUsers)

adminRoutes.post('/',auth.authenticate,auth.checkRole('admin'),admin.addUser)

adminRoutes.get('/users',auth.authenticate,auth.checkRole('admin'),admin.getAllUsers)

adminRoutes.post('/approve',auth.authenticate,auth.checkRole('admin'),admin.approveUser)

adminRoutes.post('/deny',auth.authenticate,auth.checkRole('admin'),admin.denyUser)

adminRoutes.post('/delete',auth.authenticate,auth.checkRole('admin'),admin.deleteUser)

module.exports = adminRoutes