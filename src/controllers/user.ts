import { Request, Response } from "express";
import User from "../services/user";

export const signUpController = async (req:Request, res:Response)=>{
    const {email, password} = req.body
    try {
        const result = await User.signUpUser({email, password});
        if(result.error){
            return res.status(400).json({message:result?.result?.message || "Something went wrong"})
        }
        return res.status(200).json({message:"User Registered Successfully", tokens:result.result.data})
    } catch (error) {
        return res.status(500).json({message:"Internal Server Error"});
    }
}

export const signInController = async (req:Request, res:Response)=>{
    const {email, password} = req.body
    try {
        const response = await User.signInUser({email, password})
        if(response?.error){
            return res.status(403).json({message:response.result?.message})
        }
        return res.status(200).json({message:"Sign in Successfully", tokens:response.result.data});
    } catch (error) {
        return res.status(500).json({message:"Internal Server Error"});
    }
}