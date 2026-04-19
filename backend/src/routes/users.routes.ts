import express, { type Request, type Response } from 'express';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { check, validationResult } from 'express-validator';
dotenv.config();

const router = express.Router();

router.post('/register', [
     check("firstname","first name is string").isString(),
     check("lastname","last name is string").isString(),
    check("email","email is required").isEmail(),
     check("password","minimum length of password is 6").isLength({min:6})


],async (req: Request, res: Response) => {
      
    const errors=validationResult(req);
    if(!errors.isEmpty()){ 
        return res.status(400).json({message:errors.array()})

    }
    
    try {
        // Check if the user already exists
        let user = await User.findOne({
            email: req.body.email,
        });

        if (user) {
            return res.status(401).json({ message: "User is already registered" });
        }

        // Create a new user and save it to the database
        user = new User(req.body);
        await user.save();

        // Ensure the secret key exists
        const secretKey = process.env.JWT_SECRET_KEY;
        if (!secretKey) {
            return res.status(500).json({ message: "JWT_SECRET_KEY is not set in environment variables." });
        }

        // Generate the JWT token
        const token = jwt.sign(
            { userId: user.id },
            secretKey,
            { expiresIn: "1d" }
        );

        

       res.cookie("auth_token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        maxAge:86400000
       })

       return res.status(200).send({message:"user registerd "});

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong" });
    }
});

export default router;


