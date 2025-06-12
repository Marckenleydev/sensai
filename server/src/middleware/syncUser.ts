
import { NextFunction, Request, Response } from "express";
import { checkUser } from "../controllers/user";

export const syncUserMiddleware =async(req:any, res:Response,next:NextFunction)=>{
    try {
        if(req.user){
            const dbUser = await checkUser(req.user,res);
            req.user = dbUser
        }
        next()
    } catch (error) {
        console.error("Error in sync user middleware:",error)
        next()
    }

}