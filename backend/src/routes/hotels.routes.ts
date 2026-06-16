import express ,{type Request, type Response }from 'express'
import Hotel from '../models/hotel.model.js';
import type { HotelSearchResponse } from '../shared/types.js';

const router = express.Router();

router.get('/search',async(req:Request,res:Response)=>{
    try {
        //    pagination
        const pageSize =5;
        const pageNumber = parseInt(
            req.query.page ? req.query.page.toString(): "1"
        );
        const skip = (pageNumber-1)* pageSize;
        

        const hotels = await Hotel.find().skip(skip).limit(pageSize);
           
        const total = await Hotel.countDocuments();

        const response :HotelSearchResponse ={
            data:hotels,
            pagination:{
                total,
                page:pageNumber,
                pages: Math.ceil(total/pageSize),
            }

        }
        res.json(response);
    } 
    
    catch (error) {
        console.log("error",error);
        res.status(500).json({message:"Something went wrong"});
        
        
    }
})


export default router;