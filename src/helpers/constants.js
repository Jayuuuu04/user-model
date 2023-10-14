import nodemailer from "nodemailer"

// const accessToken = {
//     exp : 50,
//     secret : "cjdgurSeienvhfrjwrD45645656456D43@vfjewi%$#defrQopchdkhhajddj"
// }
// const refreshToken = {
//     exp : 120,
//     secret:"cjdgureiefvhhS#j%A8jm3dnvhemlswmciemf222frjwr4564565jnhjv2#0Q$j"
// }

const transporter = nodemailer.createTransport({
    service: 'SMTP',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    }
})

const mailOptions = {
    from : 'your mail',
    to: email,
    subject:'Password Reset',
    text : 'Click Here to reset your password!'

}

export default {
    accessToken,
    refreshToken,
    transporter,
    mailOptions
}
