import { NextFunction, Request,Response} from "express";

import { body, validationResult } from 'express-validator';
import DatabaseManager from "../db/db";
import { existingUser } from "../services/user";

export function validateSignup(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
    }
    next();
}


export const validateSignupRules = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('confirmPassword').custom(async (value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        const isEmailUsed = await existingUser(req.body.email);
        if(isEmailUsed){
            throw new Error("Email is already in use")
        }
            
        return true;
    })
];