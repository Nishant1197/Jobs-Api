const User = require("../models/User");
const jwt=require('jsonwebtoken');
const { BadRequestError, UnauthenticatedError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const register=async(req,res)=>{
//req.body.password is modified by UserSchema pre middleware inside UserSchema model
const user = await User.create(req.body)

const token= user.createJWT()
res.json({user:{name:user.name},token})
}

const login=async(req,res)=>{
    const {email,password}=req.body
    if(!email || !password){
        throw new BadRequestError('please provide email and password')
    }
    const user = await User.findOne({email})
    if(!user){
throw new UnauthenticatedError('Invalid credentials')
    }
 const isPasswordCorrect = await user.comparePassword(password)
 if(!isPasswordCorrect){
    throw new UnauthenticatedError('Invalid credentials')
 
 }  
 const token=user.createJWT()
    res.status(StatusCodes.OK).json({user:{name:user.name},token})
   
}


module.exports={register,login}