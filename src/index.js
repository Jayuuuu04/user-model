import express from "express"
import dotenv from "dotenv"
dotenv.config()
import userRoute from "./routes/userRoute.js"
import forgotRoute from "./routes/forgotRoute.js"
const port = process.env.port

const app = express()
app.use(express.json())

app.set('view engine', 'ejs')
app.set('views', './src/views')
app.use(express.static(('public')))

app.get('/', (req,res) => {
  res.render('404')
})


app.use('/user', userRoute)
app.use('/auth', forgotRoute)

app.listen(port, () => {
    console.log(`App is Running on Port http://localhost:${port}`)
})