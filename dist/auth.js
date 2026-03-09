import argon2 from "argon2";
import jwt from "jsonwebtoken";
import crypto from "crypto";
export function makeJWT(userID, expiresIn, secret) {
    const iat = Math.floor(Date.now() / 1000);
    const payload = {
        iss: "webhook_db",
        sub: userID,
        iat,
        exp: iat + expiresIn,
    };
    return jwt.sign(payload, secret);
}
export function validateJWT(tokenString, secret) {
    try {
        const decoded = jwt.verify(tokenString, secret);
        if (!decoded.sub) {
            throw new Error("Invalid token payload");
        }
        return decoded.sub;
    }
    catch (err) {
        throw new Error("Invalid or expired token");
    }
}
export function getBearerToken(req) {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        throw new Error("Authorization header missing");
    }
    if (!authHeader.startsWith("Bearer ")) {
        throw new Error("Invalid authorization format");
    }
    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) {
        throw new Error("Token missing");
    }
    return token;
}
export function makeRefreshToken() {
    return crypto.randomBytes(32).toString("hex");
}
export async function hashPassword(password) {
    try {
        const hash = await argon2.hash(password);
        return hash;
    }
    catch (err) {
        console.error(err);
        return "unset";
    }
}
export async function checkPasswordHash(password, hash) {
    try {
        if (await argon2.verify(hash, password)) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (err) {
        console.error(err);
        return false;
    }
}
