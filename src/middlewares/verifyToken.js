import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const verifyToken = (req, res, next) => {
    const bearer = req.headers['authorization'];
    if (!bearer) {
        return res.status(401).json({
            error: true,
            message: "Error!!! Please Provide Bearer Token"
        });
    }
    const token = bearer.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.user = decoded.payload
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                error: true,
                message: "Access Token Has Expired. Generate a New Token to Proceed"
            });
        }
        return res.status(401).json({
            error: true,
            message: "Invalid Token"
        });
    }
}

export default  verifyToken