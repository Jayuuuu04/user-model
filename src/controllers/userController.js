import knex from "../config/mysql_db.js"
import Joi from "joi"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
const tableName = "users"

const getAllUser = async (req, res) => {
    try {
        const users = await knex(tableName)

        users.forEach(user => {
            delete user.password;
        });

        if (!users) {
            return res.status(400).json({
                error: true,
                message: "Failed to List Users!!!",
                data: []
            })
        }
        return res.status(200).json({
            error: false,
            message: "User Data Fatched Successfully!!!!",
            data: users
        })
    } catch (err) {
        return res.status(400).json({
            error: true,
            message: "Failed to Access User",
            data: err.message
        }).end()
    }
}

const registerUser = async (req, res) => {
    try {
        const registerSchema = Joi.object({
            f_name: Joi.string().required(),
            l_name: Joi.string().required(),
            username: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).max(12).required(),
            dob: Joi.string().isoDate().required(),
            gender: Joi.string().valid('Male', 'Female', 'Other').required(),
            address: Joi.string().required(),
            ph_no: Joi.string().length(10).pattern(/^[0-9]+$/).required()
        })
        const { error, value } = registerSchema.validate(req.body, { abortEarly: false })
        if (error) {
            return res.status(400).json({
                error: true,
                message: error.details.map((detail) => detail.message),
                data: null
            })
        }

        const { f_name, l_name, username, email, password, dob, gender, address, ph_no } = value

        const hashedPassword = await bcrypt.hash(password, 10)

        const userAvailabe = await knex(tableName)
            .where({ 'email': email })
            .orWhere({ 'username': username })
            .first()


        if (userAvailabe) {
            return res.status(400).json({
                error: true,
                message: "User Already Registered!!!!!!",
                data: null
            })
        }

        const [data] = await knex(tableName).insert({
            f_name,
            l_name,
            username,
            email,
            password: hashedPassword,
            dob,
            gender,
            address,
            ph_no

        })

        if (!data) {
            return res.status(400).json({
                error: true,
                message: "Failed To Insert Data !!!!!",
                data: []
            })
        }
        return res.status(201).json({
            error: false,
            message: "User Created Successfully!!!!",
            data: {
                id: data,
                f_name,
                l_name,
                username,
                email,
                dob,
                gender,
                address,
                ph_no
            }
        })
    } catch (err) {
        res.status(500).json({
            error: true,
            message: "Error!!!!!Internal Server Error",
            data: null
        })
    }
}

async function getUserData(username, email) {
    try {
        if (username) {
            return await knex(tableName).where({ username }).first();
        } else if (email) {
            return await knex(tableName).where({ email }).first();
        }
        return null;
    } catch (error) {
        throw error;
    }
}


const login = async (req, res) => {
    try {
        const schema = Joi.object({
            username: Joi.string().min(5),
            email: Joi.string().email().min(10).max(50),
            password: Joi.string().min(6).max(30).required()
        }).xor('username', 'email')

        const { error, value } = schema.validate(req.body)

        if (error) {
            return res.status(400).json({
                error: true,
                message: error.details.map((detail) => detail.message),
                data: null
            })
        }
        const { username, email, password } = value

        const user = await getUserData(username, email);

        if (!user) {
            return res.status(404).json({
                error: true,
                message: "User Not Found!!!"
            })
        }

        const validPassword = await bcrypt.compare(password, user.password)

        if (!validPassword) {
            return res.status(400).json({
                error: true,
                message: "Invalid Password!!"
            })
        }

        const payload = {
            id: user.id,
            f_name: user.f_name,
            l_name: user.l_name,
            username: user.username,
            email: user.email,
            dob: user.dob,
            gender: user.gender,
            address: user.address,
            ph_no: user.ph_no,
            status: user.status,
        }

        const access = jwt.sign({
            payload, exp: Math.floor(Date.now() / 1000) + 60 //accessToken.exp
        }, process.env.ACCESS_TOKEN_SECRET)

        const refresh = jwt.sign({
            payload, exp: Math.floor(Date.now() / 1000) +  120  //refreshToken.exp
        }, process.env.REFRESH_TOKEN_SECRET)

        return res.status(200).json({
            error: false,
            message: "User LoggedIn Successfully",
            data: {
                payload,
                access,
                refresh
            }
        })
    } catch (err) {
        res.status(500).json({
            error: true,
            message: "Error!!!!Internal Server Error!!",
            data: null
        })
    }
}

const registerForm = async (req,res) => {
    try {
        res.render('register')
    } catch (err) {
        console.log(err)
    }
}

const loginForm = async (req,res) => {
    try {
        res.render('login')
    } catch (err) {
        console.log(err)
    }
}

const welcomeForm = async (req,res) => {
    try {
        res.render('welcome')
    } catch (err) {
        console.log(err)
    }
}

export default {
    registerUser,
    login,
    loginForm,
    getAllUser,
    welcomeForm,
    registerForm
}

