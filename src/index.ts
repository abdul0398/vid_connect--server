import  DatabaseManager  from "./db/db";
import { initialiseServer } from "./services/express";

async function startApp(){
    try {
        await initialiseServer();
        await DatabaseManager.initialiseDb();
    } catch (error) {
        console.error("Error starting the app:", error);
    }
}


startApp();