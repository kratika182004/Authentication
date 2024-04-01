import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors';
import connectDB from './config/connectdb.js';
import userRoutes from './routes/userRoutes.js'


//import ('./config/connectiondb.js').connect();
const port = 3000;





const app= express();
//const port = process.env.PORT
const DATABASE_URL= process.env.DATABASE_URL


app.use(cors());
//database connection
connectDB(DATABASE_URL);
app.use(express.json());
//routes
app.use("/api/user",userRoutes)












app.listen(port,()=>{
    console.log(`port is started ${port}`);
})