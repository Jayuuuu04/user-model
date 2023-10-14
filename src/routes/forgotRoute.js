import express from "express"
import passwordController from "../controllers/passwordController.js"
const router = express.Router()


router.get('/forgot-password', passwordController.forgotPasswordForm)
router.post('/forgot-password', passwordController.forgotPassword)

router.get('/reset-password', passwordController.resetPasswordForm)
router.put('/reset-password', passwordController.resetPassword)

router.get('/otp', passwordController.otpForm)
router.post('/otp', passwordController.otpCheck)

export default router