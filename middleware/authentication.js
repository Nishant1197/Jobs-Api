const  {UnauthenticatedError}=require('../errors')

const jwt=require('jsonwebtoken')

const authMiddleware=(req,res,next)=>{
const {authorization}=req.headers
if(!authorization || !authorization.startsWith('Bearer '))
{
    throw new UnauthenticatedError('Authentication invalid')

}
const candidateToken=authorization.split(' ')[1]
try{
    const token=jwt.verify(candidateToken,process.env.JWT_SECRET)
    req.user={userId:token.userId,name:token.name}
    next()
}
catch(err){
    throw new UnauthenticatedError('Authentication invalid') 
}
}

module.exports=authMiddleware