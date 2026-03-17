import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { getDeliveriesForUser,getAllDeliveries,getDeliveryByPipeline } from "../db/queries/deliveries.js";
import { checkPipelineBelongToUser } from "../db/queries/pipelines.js";
import { isAdmin } from "../db/queries/users.js";
export const getDeliveries = async (
    req:AuthenticatedRequest,
    res:Response
)=>{
    const user_id= parseInt(req.userId as string);
    const status = req.query.status ; 
    if(typeof(status)!== 'string'){
        const result= await getDeliveriesForUser(user_id);
        if(result.length===0){
            return res.status(400).json({error:'no deliveried available for user'});
        }
        return res.status(200).json(result);
    }else{
        const result = await getDeliveriesForUser(user_id,status);   
        if(result.length===0){
            return res.status(400).json({error:'no deliveried available for user'});
        }
        return res.status(200).json(result);
    }
    
};
export const getDeliveriesByPipeline = async (
    req:AuthenticatedRequest,
    res:Response
)=>{
    try{
    const userId= parseInt(req.userId as string);
    const pipelineId= parseInt(req.params.pipelineId as string);
    const belongs= await checkPipelineBelongToUser(userId,pipelineId);
    const Admin = await isAdmin(userId);
    if(!belongs && !Admin){
        return res.status(401).json({error:"this user is not authorized to access data of this pipeline"});
    }
    const result = await getDeliveryByPipeline(pipelineId,userId);
    if(result.length===0){
        return res.status(404).json({error:"this pipeline has no delivery records"});
    }
    return res.status(200).json(result);
}catch(err){
    console.error(err);
    throw err;
}
};
export const getDeliveriesforAdmin = async (
    req:AuthenticatedRequest,
    res:Response
)=>{
    try{
        const userId= parseInt(req.userId as string);
        if(!await isAdmin(userId)){
            return res.status(401).json({error:"UnAuthorized access"});
        }
        const status= req.query.status;
        if(typeof(status) === "string"){
           const result = await getAllDeliveries(status); 
           return res.status(200).json(result);
        }
        const result = await getAllDeliveries()
        return res.status(200).json(result);
    }catch(err){
        console.error(err);
        throw err;
    }
}