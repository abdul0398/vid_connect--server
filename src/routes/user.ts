import express, {Router , Request, Response} from "express";
const router :Router = express.Router();


router.get("/user", async (req :Request, res : Response) => {
    res.send("Hello from user route");
});