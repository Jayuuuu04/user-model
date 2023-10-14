import express from "express"
import userController from "../controllers/userController.js"
const router = express.Router()
import verifyToken from "../middlewares/verifyToken.js"

router.get('/all-user', verifyToken,userController.getAllUser)

router.get('/register', userController.registerForm)
router.post('/register', userController.registerUser)




router.post('/auth/login', userController.login)
router.get('/auth/login', userController.loginForm)

router.get('/auth/welcome', userController.welcomeForm)

export default router