const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const UserSchema=mongoose.Schema({
name:{
    type:String,
    required:[true,'Please provide name'],
   minLength:3,
   maxLength:12
},
email:{
    type:String,
    required:[true,'Please provide email'],
    match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'Please provide valid email'],
    unique:true
},
password:{
    type:String,
    required:[true,'Please provide password'],
    minLength:6
}



},{timestamps:true})


UserSchema.pre('save',async function(){
const salt=await bcrypt.genSalt(10)
//this will not change req.body instead it changes password while creation of document in database
this.password=await bcrypt.hash(this.password,salt)

})

UserSchema.methods.createJWT = function(cb) {
    return jwt.sign({userId:this._id,name:this.name},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRY})

  };
  UserSchema.methods.comparePassword =async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword,this.password)
  };
  


const User=mongoose.model('User',UserSchema)

module.exports=User