import express,{type Request,type Response, type NextFunction} from 'express'
import multer from 'multer'
import cloudinary from "cloudinary"
import type { HotelType } from '../models/hotel.model.js';
import Hotel from '../models/hotel.model.js';
import verifyToken from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage:storage,
    limits:{
        fileSize:5*1024 *1024   // 5Mb

    }
})



router.post('/',
    verifyToken,
    upload.array("imageFiles",6),
    (req: Request, res: Response, next: NextFunction) => {
        if (req.body.facilities && typeof req.body.facilities === 'string') {
            req.body.facilities = [req.body.facilities];
        }
        next();
    },
    [  
        body("name").notEmpty().withMessage("Name is required"),
        body("city").notEmpty().withMessage("City is required"),
        body("country").notEmpty().withMessage("Country is required"),
        body("description").notEmpty().withMessage("Description is required"),
        body("type").notEmpty().withMessage("Hotel type is required"),
        body("pricePerNight").notEmpty().isNumeric().withMessage("price per night is required and must be a number"),
        body("facilities").notEmpty().isArray().withMessage("Facilities are required"),
    ],
    async(req:Request , res:Response)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({message:errors.array()})
        }
        try {
     const imageFiles = req.files as Express.Multer.File[];
      const newHotel:HotelType = req.body;
   
    
      const uploadPromises= imageFiles.map(async(image)=>{
          const b64= Buffer.from(image.buffer).toString("base64")
          let dataURI= "data:"+image.mimetype +  ";base64," +b64;
         
          const res= await cloudinary.v2.uploader.upload(dataURI)
           return res.url;
        })

   
        const imageUrls = await Promise.all(uploadPromises )
   //
   
   newHotel.imageUrls= imageUrls;
   newHotel.lastUpdated= new Date();
   newHotel.userId= req.userId;

const hotel = new Hotel(newHotel);
await hotel.save();

res.status(201).send(hotel);


    } catch (error) {
        console.log("Error creating hotel",error);
        res.status(500).json({message:"something went wrong"})
        
     }
})



router.get("/",verifyToken,async(req:Request , res:Response)=>{
    
    try {
const hotels = await Hotel.find({userId:req.userId})
    res.json(hotels);

        
    } catch (error) {
        res.status(500).json({message:"Error fetching hotels"})
        
    }

})


export default router;