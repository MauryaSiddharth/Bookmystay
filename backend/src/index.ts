import express, { type Request, type Response } from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose';
import userRoutes from './routes/users.routes.js';
import authRoutes from './routes/auth.routes.js';
import cookieParser from "cookie-parser"
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
  origin:process.env.FRONTEND_URL,
  credentials:true,
}))

  app.use(express.static(path.join(__dirname,"../../frontend/dist")));

app.use('/api/auth',authRoutes)
app.use('/api/users',userRoutes)

app.get(/(.*)/, (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});
const connectDB= async ()=>{
      try {
        if(!process.env.MONGO_URI){
             throw new Error("MONGO_URI not found in .env")
        }

         await mongoose.connect(process.env.MONGO_URI)

         console.log("✅ MongoDB connected");

         app.listen(3000,()=>{
         console.log("server is running on local");
    
})
         
      } catch (error) {
        console.log("❌ Error starting server:", error);
        process.exit(1);
        
      }
}

connectDB();