import knex from "../config/mysql_db.js"
import Joi from "joi"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
dotenv.config()
const tableName = "users"
import sendMail from '../validations/sendMail.js'
const table = "otp"

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        const schema = Joi.object({
            email: Joi.string().email().required(),
        })
        const { error, value } = schema.validate(req.body)

        if (error) {
            return res.status(400).json({
                error: true,
                message: error.details.map((detail) => detail.message),
                data: null
            })
        }
        const user = await knex(tableName)
            .where({ 'email': email })
            .first()
        if (!user) {
            return res.status(404).json({
                error: true,
                message: "Email Not Found!!"
            }).end()
        }
        const otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

        let content = `Your One Time Password  is : " ${otp} " Do Not Share With Anyone`

        const emailResponse = sendMail(email, content, res)

        if (emailResponse.error) {
            return res.status(400).json(emailResponse)
        }
        const expireAt = new Date();
        expireAt.setHours(expireAt.getHours() + 1)

        const userOtp = await knex(table)
            .where({ 'email': email })
            .first()
        if (userOtp == undefined) {
            await knex(table).insert({
                email,
                otp,
                expires_at: expireAt
            })

        } else {
            if (userOtp.otp === 0) {
                await knex(table)
                    .where({ 'email': email })
                    .update({ 'otp': otp })
            }else{
                return res.status(400).json({
                    error:true,
                    message:"Unable to Update OTP"
                })
            }

        }
    } catch (err) {
        console.log(err)
    }
}

const forgotPasswordForm = async (req, res) => {
    try {
        res.render('forgot-password')
    } catch (err) {
        console.log("View Not Found" + err)
    }
}


const otpCheck = async (req, res) => {
    try {

        const otp = req.body.otp;

        const schema = Joi.object({
            otp: Joi.number().min(100000).max(999999).required()
        })

        const { error } = schema.validate({ otp })

        if (error) {
            return res.status(400).json({
                error: true,
                message: error.details.map((detail) => detail.message),
                data: null
            })
        }
        const user = await knex(table)
            .where({ 'otp': otp })
            .first()

        if (!user) {
            return res.status(404).json({
                error: true,
                message: "Invalid OTP !! Please Provide Valid one-time-password!!!!"
            }).end()
        }
        if (user) {
            await knex(table)
                .where({ 'otp': otp })
                .update({ otp: "" })
        }
        return res.status(200).json({
            error: false,
            message: "OTP Varified Successfully!!!!!"
        })
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error!!!!!",
            data: null
        })
    }

}

const otpForm = async (req, res) => {
    try {
        res.render('otp')
    } catch (err) {
        console.log("View Not Found" + err)
    }
}

const resetPassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body

        const schema = Joi.object({
            email: Joi.string().email(),
            newPassword: Joi.string().min(6).max(12).required(),
            confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
        })
        const { error, value } = schema.validate(req.body)

        if (error) {
            return res.status(400).json({
                error: true,
                message: error.details.map((detail) => detail.message),
                data: null
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        const a = await knex(tableName)
            .where({ 'email': email })
            .update({ 'password': hashedPassword })

        console.log(a)

        return res.status(200).json({
            error: false,
            message: "Password reset successfully"
        })

    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error!!!!!",
            data: null
        })
    }
}

const resetPasswordForm = async (req, res) => {
    try {
        res.render('reset-password')
    } catch (err) {
        console.log(err)
    }
}

export default {
    forgotPassword,
    forgotPasswordForm,
    otpCheck,
    otpForm,
    resetPassword,
    resetPasswordForm
}