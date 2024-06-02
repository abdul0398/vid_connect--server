import mysql2, {Pool, PoolOptions} from 'mysql2/promise';
import { promises as fs } from "fs";
import path from "path";



export default class DatabaseManager {
    static pool: Pool;   
    
    static async initialiseDb(): Promise<void> {
        if (!DatabaseManager.pool) {
            const poolOptions: PoolOptions = {
                host: process.env.DB_HOST || "127.0.0.1",
                user: process.env.DB_USER || "root",
                password: process.env.DB_PASSWORD || "Neet@2019",
                database: process.env.DB_NAME || "vidconnect",
            };

            DatabaseManager.pool = mysql2.createPool(poolOptions);
            try {
                await DatabaseManager.createTables()
                console.log("Database pool initialised successfully.");
            } catch (error) {
                console.error("Error initialising database pool:", error);
            }

        } else {
            console.log("Database pool already initialised.");
            return Promise.resolve();
        }
    }

    private static async createTables() {
        try {
            const modelsDir = path.join(__dirname, "../../src/" ,"models");
            const files = await fs.readdir(modelsDir);
            const sqlFiles = files.filter(file => file.endsWith(".sql"));
            const sqlQueries = await Promise.all(sqlFiles.map(file => fs.readFile(path.join(modelsDir, file), "utf-8")));

            await Promise.all(sqlQueries.map(query => DatabaseManager.pool.query(query)));

            console.log("Tables created successfully");
        } catch (error) {
            console.error("Error creating tables:", error);
        }

    }







}
    

// export async function initialiseDb(){
//     const poolOptions : PoolOptions = {
//         host: process.env.DB_HOST || "127.0.0.1",
//         user: process.env.DB_USER || "root",
//         password: process.env.DB_PASSWORD || "Neet@2019",
//         database: process.env.DB_NAME || "vidconnect",
//     };

//     const pool :Pool = mysql2.createPool(poolOptions);
//     await createTables(pool);
// }


// async function createTables(pool: Pool) {
//     try {
//         const modelsDir = path.join(__dirname, "../../src/" ,"models");
//         const files = await fs.readdir(modelsDir);
//         const sqlFiles = files.filter(file => file.endsWith(".sql"));
//         const sqlQueries = await Promise.all(sqlFiles.map(file => fs.readFile(path.join(modelsDir, file), "utf-8")));

//         await Promise.all(sqlQueries.map(query => pool.query(query)));

//         console.log("Tables created successfully");
//     } catch (error) {
//         console.error("Error creating tables:", error);
//     }
// }
