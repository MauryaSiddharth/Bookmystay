import express,{type Request,type Response, type NextFunction} from 'express'
import multer from 'multer'
import cloudinary from "cloudinary"
import type { HotelType } from '../shared/types.js';
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


router.get('/:id',verifyToken,async(req:Request,res:Response)=>{
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({ message: "Hotel ID is required" });
    }
    
   
    try {
        const hotel = await Hotel.findOne({
            _id:id,
            userId:req.userId,
        })
        res.json(hotel);

  
    } catch (error) {
        res.status(500).json({message:"error fetching hotels"})
        
    }
})

router.put('/:id',
    verifyToken,
    upload.array("imageFiles"),
    (req: Request, res: Response, next: NextFunction) => {
        if (req.body.facilities && typeof req.body.facilities === 'string') {
            req.body.facilities = [req.body.facilities];
        }
        next();
    },
    async (req: Request, res: Response) => {
        try {
            const hotelId = req.params.id;
            if (!hotelId) {
                return res.status(400).json({ message: "Hotel ID is required" });
            }

            const hotel = await Hotel.findOne({
                _id: hotelId,
                userId: req.userId,
            });

            if (!hotel) {
                return res.status(404).json({ message: "Hotel not found" });
            }

            hotel.name = req.body.name;
            hotel.city = req.body.city;
            hotel.country = req.body.country;
            hotel.description = req.body.description;
            hotel.type = req.body.type;
            hotel.pricePerNight = req.body.pricePerNight;
            hotel.facilities = req.body.facilities;
            hotel.adultCount = req.body.adultCount;
            hotel.childCount = req.body.childCount;
            hotel.starRating = req.body.starRating;
            hotel.lastUpdated = new Date();

            const files = req.files as Express.Multer.File[];
            const uploadPromises = files.map(async (image) => {
                const b64 = Buffer.from(image.buffer).toString("base64");
                let dataURI = "data:" + image.mimetype + ";base64," + b64;
                const res = await cloudinary.v2.uploader.upload(dataURI);
                return res.url;
            });

            const newImageUrls = await Promise.all(uploadPromises);

            let existingImageUrls: string[] = [];
            if (req.body.imageUrls) {
                existingImageUrls = Array.isArray(req.body.imageUrls)
                    ? req.body.imageUrls
                    : [req.body.imageUrls];
            }

            hotel.imageUrls = [...existingImageUrls, ...newImageUrls];

            await hotel.save();
            res.status(200).json(hotel);
        } catch (error) {
            console.log("Error updating hotel", error);
            res.status(500).json({ message: "Something went wrong" });
        }
    }
);


export default router;