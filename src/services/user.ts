import DatabaseManager from "../db/db";
import {RowDataPacket} from "mysql2"
import { AuthFields } from "../types/user";
export async function existingUser(email:string):Promise<boolean>{
    try {
        const [rows] = await DatabaseManager.pool.query<RowDataPacket[]>(`
        SELECT COUNT(*) AS count FROM users WHERE email = ?`, [email]);
        const count = parseInt(rows[0]['count'], 10);
        return count > 0;
    } catch (error) {
        throw Error("Something wrong with fetching user");

    }    
}

export async function registerUser(data:AuthFields){
    try {
        
    } catch (error) {
        
    }



}