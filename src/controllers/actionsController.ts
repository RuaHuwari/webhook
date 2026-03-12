import { Request,Response } from "express";
import { getAllActions } from "../db/queries/actions.js";
export const getActions = async(req:Request, res:Response)=>{
    const actions= await getAllActions();
    if(actions.length===0){
        return res.status(400).json({error:"cannot fetch actions"});
    }
    return res.status(200).json(actions);
}