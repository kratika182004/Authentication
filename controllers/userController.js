import UserModel from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../config/emailconfig.js";


class UserController{
    static userRegistration = async ( req,res)=>{ 
       const {name,email,password,password_confirmation} = req.body
       const user =await UserModel.findOne({email:email})
       if(user){
        return res.status(400).json({message:"email already exist"})
       }else{
        if(name && email && password && password_confirmation ){
            if(password === password_confirmation){
               try{
                const salt = await bcrypt.genSalt(10)
                const hashPassword = await bcrypt.hash(password,salt)
                const doc =new UserModel({
                    name:name,
                    email:email,
                    password:hashPassword
                })
                await doc.save()
                const saved_user = await UserModel.findOne({email:email})
                //generate jwt token
                const token = jwt.sign({userID: saved_user._id},process.env.JWT_SECRET_KEY,{expiresIn:'2d'})
                return res.status(200).json({msg:"user registre","token": token})

               }catch (error){
                return res.status(400).json({message:"unable to register"});
               }
            }else{
                return res.status(400).json({message:"password is not equal to confirm password"})  
            }
        }else{
            return res.status(400).json({message:"all flied are required"})
            
        }
       }

    }
    static userLogin = async (req,res)=>{
        try {
            const {email ,password}= req.body
            if(email && password){
                const user =await UserModel.findOne({email:email})
                
                if(user != null){
                    const isMatch= await bcrypt.compare(password,user.password)
                    if((user.email === email) && isMatch){
                        //gentrate token
                        const token = jwt.sign({userID: user._id},process.env.JWT_SECRET_KEY,{expiresIn:'2d'})
                
                        return res.status(200).json({msg:"login sucess","token":token})
                    }else{
                        return res.status(400).json({message:"email and password is not match"})
                    }
                }else{
                    return res.status(400).json({message:"you are not register user"})
                }
            }else{
                return res.status(400).json({message:"all flied are required"})
                
            }
            
        } catch (error) {
            console.log(error)
            return res.status(400).json({message:"unable to login"})
        }
    }
    static sendUserPasswardRestEmail = async(req,res)=>{
        const{email}= req.body
        if(email){
            const user = await UserModel.findOne({email : email })
            
            if(user){
                const secret = user._id + process.env.JWT_SECRET_KEY
                const token = jwt.sign({userID:user._id},secret,{expiresIn :'20m'})
                const link =`http://27.0.0.1:8000/api/user/reset/${user._id}/${token}`
                console.log(link)
                //send email
                let info = await transporter.sendMail({
                    from:process.env.EMAIL_FROM,
                    to:user.email,
                    subject:'loginsignup - password Reset Link',
                    html:`<a href = ${link}> click here</a>to reset your password`
                })
                return res.status(200).json({massage:"check your email for reset password","info":info})
            }
            else{
                return res.status(400).json({message:"email does not exist"})
            }
        }
        else{
            return res.status(400).json({message:"all filed are required"})
        }
    }
    static userPasswordReset = async(req,res)=>{
        const {password,password_confirmation}= req.body
        const {id,token}= req.params
        const user = await UserModel.findById(id)
        const new_secret= user.id + process.env.JWT_SECRET_KEY
        try {
            jwt.verify(token,new_secret)
            if(password && password_confirmation){
                if(password!==password_confirmation){
                    return res.status(400).json({message:"passward and confirm passward are not equal"})
                }else{
                    const salt = await bcrypt.genSalt(10)
                    const newHashPasword = await bcrypt.hash(paaword,salt)
                    await UserModel.findByIdAndUpdate(user._id,{$set:{password:newHashPasword}})
                    return res.status(200).json({message:"password reset sucessfuly"})
                }
            }else{
                return res.status(400).json({massage:"all field are required"})
            }
            
        } catch (error) {
          console.log(error)
             return res.status(400).json({message:"invalid token"})
           
        }
    }
}
export default UserController