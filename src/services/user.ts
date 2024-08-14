import DatabaseManager from "../db/db";
import { RowDataPacket } from "mysql2";
import { AuthFields } from "../types/user";
import bcrypt from "bcrypt";
import { fnRes } from "../types/general";
import jwt from "jsonwebtoken";
import { resWrapper } from "../helpers/wrappers";
import 'dotenv/config'

const access_jwt_key = process.env.ACCESS_JWT_KEY as string;
const refresh_jwt_key = process.env.REFRESH_JWT_KEY as string;


class User {
  static async existingUser(email: string): Promise<fnRes> {
    try {
      const [rows] = await DatabaseManager.pool.query<RowDataPacket[]>(
        `SELECT * FROM users WHERE email = ?`,
        [email]
      );

      if (rows.length > 0) {
        return resWrapper(rows[0], "Email is already in use");
      }
      return resWrapper(null, "User not found with this Email");
    } catch (error) {
      throw new Error("Something went wrong with fetching user");
    }
  }

  static async signUpUser(data: AuthFields): Promise<fnRes> {
    const { email, password } = data;
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      await DatabaseManager.pool.query(
        `INSERT INTO users (email, password) VALUES (?, ?)`,
        [email, hashedPassword]
      );

      const { result } = await this.signInUser(data);
      return resWrapper(result.data, "User created successfully");
    } catch (error: any) {
      return resWrapper(null, "Something went wrong");
    }
  }

  static async signInUser(data: AuthFields): Promise<fnRes> {
    const { email, password } = data;
    try {
      const user = await this.existingUser(email);
      if (user.error || !user.result.data) {
        return resWrapper(null, user.result.message);
      }

      const hashedPassword = user.result.data.password as string;
      const isPassCorrect = await bcrypt.compare(password, hashedPassword);
      if (!isPassCorrect) {
        return resWrapper(null, "Password is incorrect");
      }

      const id = user.result.data.id;
      const tokens = await this.getTokens(id);
      return resWrapper(tokens, "Sign in successfully");
    } catch (error) {
      console.log(error);
      return resWrapper(null, "Something went wrong during sign-in");
    }
  }

  private static async getTokens(id: number): Promise<{ accessToken: string, refreshToken: string }> {
    const payload = { id };
    const accessToken = jwt.sign(payload, access_jwt_key, {
      expiresIn: "1d" // 1 day
    });

    const refreshToken = jwt.sign(payload, refresh_jwt_key, {
      expiresIn: "7d" // 7 days
    });

    await DatabaseManager.pool.query(
      `UPDATE users SET refreshToken = ? WHERE id = ?`,
      [refreshToken, id]
    );

    return { accessToken, refreshToken };
  }

  static async refreshToken(oldRefreshToken: string): Promise<fnRes> {
    try {
      const decoded: any = jwt.verify(oldRefreshToken, refresh_jwt_key);

      const [rows] = await DatabaseManager.pool.query<RowDataPacket[]>(
        `SELECT * FROM users WHERE id = ? AND refreshToken = ?`,
        [decoded.id, oldRefreshToken]
      );

      if (rows.length === 0) {
        return resWrapper(null, "Invalid refresh token");
      }

      const tokens = await this.getTokens(decoded.id);
      return resWrapper(tokens, "Token refreshed successfully");
    } catch (error: any) {
      return resWrapper(null, "Invalid refresh token");
    }
  }
}

export default User;
