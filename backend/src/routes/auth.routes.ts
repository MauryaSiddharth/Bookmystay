import express ,{type Request, type Response }from 'express'
import { check, validationResult } from 'express-validator';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
 import verifyToken from '../middleware/auth.js';
const router = express.Router();

router.post('/login',[
    check('email',"email is required").isEmail(),
    check('password',"password must be above 6 character").isLength({min:6})
],async (req: Request, res: Response)=>{

    const errors= validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({message:errors.array()})
    }
             
    const {email,password} = req.body;
    try {
         const user = await User.findOne({email});
         if(!user){
            return res.status(400).json({message:"kindly register first"})
         }

         const isMatch = await bcrypt.compare(password,user.password);
          if(!isMatch){
            return res.status(400).json({message:"Incorrect Password"})
          }

           const secretKey = process.env.JWT_SECRET_KEY;
        if (!secretKey) {
            return res.status(500).json({ message: "JWT_SECRET_KEY is not set in environment variables." });
        }

        const token = jwt.sign(
            {userId:user.id},
             secretKey,
            {expiresIn:"1d"}
        )

        res.cookie("auth_token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            maxAge:86400000
        })

        return res.status(200).json({userId:user._id})

    } catch (error) {
        console.log(error);
       return res.status(500).json({message:'Something went wrong'})
        
    }
})

router.get('/validate-token',verifyToken,(req: Request, res: Response)=>{
    res.status(200).send({userId:req.userId})

})

router.post('/logout',(req:Request,res:Response)=>{
    res.cookie("auth_token","",{
        expires:new Date(0),
    })
    res.send();
})


export default router
