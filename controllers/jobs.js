const { StatusCodes } = require("http-status-codes")
const { NotFoundError, BadRequestError } = require("../errors")
const Job = require("../models/Job")

const getAllJobs=async(req,res)=>{
    const jobs=await Job.find({createdBy:req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({jobs,count:jobs.length})
    }
    
    const getJob=async(req,res)=>{
        // You can give alias name like params:{id:jobId}
        const {user:{userId},params:{id}}= req
        const job=await Job.findOne({_id:id,createdBy:userId})
        if(!job){
            throw new NotFoundError('No job with id found')
        }
        res.status(StatusCodes.OK).json(job)
    }

    const createJob=async(req,res)=>{
        req.body.createdBy=req.user.userId
 const job =await Job.create(req.body)
      res.status(StatusCodes.CREATED).json(job)
        }
        
        const updateJob=async(req,res)=>{
            const {
                body:{company,position},
                user:{userId},
                params:{id}
            }= req
        
        if(company==='' || position==='')
            throw new BadRequestError('Company or Position fields cannot be empty')
        const job = await Job.findByIdAndUpdate({_id:id,createdBy:userId},req.body,{new:true,runValidators:true})
        if(!job){
            throw new NotFoundError('No job found with id')
        }
        res.status(StatusCodes.OK).json({job}) 
        }

        const deleteJob=async(req,res)=>{
            const {
                body:{company,position},
                user:{userId},
                params:{id}
            }= req
        const job = await Job.findByIdAndRemove({_id:id,createdBy:userId})
        if(!job){
            throw new NotFoundError('No job found with id')
        }
        res.status(StatusCodes.OK).json({job}) 
  
    }
    module.exports={getAllJobs,getJob,createJob,updateJob,deleteJob}
       