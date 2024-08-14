import express, {Router} from "express";
import {validateSignIn, validateSignInRules, validateSignUp, validateSignUpRules} from "../middlewares/validateInputs";
import { signInController, signUpController } from "../controllers/user";
import { isAuthorize } from "../middlewares/validateUser";
const router :Router = express.Router();


router
.post("/auth/signup", validateSignUpRules, validateSignUp, signUpController)
.post("/auth/signin", validateSignInRules, validateSignIn,  signInController)
.get("/user/getUser", isAuthorize, (req,res)=>{
    console.log("Authorized")
})

export default router;