import mongoose from "mongoose";
const connectDB =async(DATABASE_URL)=>{
    try{
        const DB_option={
            dbName:"loginsignup"
        }
        await mongoose.connect(DATABASE_URL, DB_option)
        console.log("connected sucessfully");
    }catch(error){
        console.log(error)
    }
}
export default connectDB