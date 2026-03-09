import { Request, Response } from "express";
import { createUser, getUserByEmail } from "../db/queries/users.js";
import jwt from "jsonwebtoken";
import { checkPasswordHash, hashPassword } from "../auth.js";
import * as dotenv from "dotenv";
const JWT_SECRET = "aVZZm7cVri4qOIRTO1oRP2deEWwtKmsFimbtenBYIYqfOnSsVCrym88QJpOSLoEwPFM0qLe7uKSsvYWHpwcr8w";

export const signup = async (req: Request, res: Response) => {
  const { email, password ,role} = req.body;

  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashed_password= await hashPassword(password);
    const user = await createUser(email, hashed_password,role);

    res.status(201).json({
      message: "User created",
      userId: user.id,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const validPassword = await checkPasswordHash(password,user.password);

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};