import express, {Router , Request, Response} from "express";
import {validateSignup, validateSignupRules} from "../middlewares/validateInputs";
const router :Router = express.Router();


router.get("/user", async (req :Request, res : Response) => {
    res.send("Hello from user route");
}).post("/auth/signup", validateSignupRules, validateSignup, async (req :Request, res : Response) => {


    console.log(req.body);





})


export default router;