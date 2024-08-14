import { NextFunction, Request,Response} from "express";
import { body, validationResult } from 'express-validator';
import User from "../services/user";

export function validateSignUp(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
}

export function validateSignIn(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
}



export const validateSignUpRules = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('confirmPassword').custom(async (value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        const user = await User.existingUser(req?.body?.email);
        if(user.result.data){
            throw new Error(user?.result?.message || "User already Exists")
        }
        return true;
    })
];

export const validateSignInRules = [
    body('email').isEmail().withMessage('Invalid email format').custom(async (value, {req})=>{
        const {email} = req.body
        const user = await User.existingUser(email);
        if(!user.result.data){
            throw new Error(user?.result?.message || "User not Found");
        }
        return true;
    }),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
];