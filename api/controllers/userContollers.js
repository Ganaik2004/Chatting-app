import User from "../models/user.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';
export const login = async(req,res,next)=>{
    const { email, password } = req.body;
    try {
      const validUser = await User.findOne({ email });
      if (!validUser) return next(errorHandler(404, 'User not found!'));
      const validPassword = bcryptjs.compareSync(password, validUser.password);
      if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));
      const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = validUser._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    } catch (error) {
      next(error);
    }
}
export const signup = async(req,res,next)=>{
   const {name,email,password,pic} = req.body;
   if(!name || !email || !password){
    return next(errorHandler(404, 'Please Fill All The Details!'));
   }
   const userExists = await User.findOne({email});
   if(userExists){
    return next(errorHandler(404, 'User Is Already Exists!'));
   }
   const hashedpassword = bcryptjs.hashSync(password,12)
   const newUser = new User({name,email,password:hashedpassword,pic});
   try{
       await  newUser.save();
       res.status(201).json("User Created successfully!");
   }
 catch(err){
  next(err);
 }
}
export const getUser = async(req,res,next)=>{
  const keyword = req.query.q?{
    $or:[
      {name:{$regex:req.query.q,$options:"i"}},
      {email:{$regex:req.query.q,$options:"i"}}
    ]
  }:{};
  const users = await User.find(keyword,{ password: 0 }).find({_id:{$ne:req.user.id}});
  res.status(200).json(users);
}
export const signout = async(req,res,next)=>{
  try{
    res.clearCookie('access_token');
    res.status(200).json("User is logged out")
       }catch(error){
           next(error);
       }
      }
