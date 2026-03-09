import argon2 from "argon2";
import jwt, {JwtPayload} from "jsonwebtoken";
import crypto from "crypto";
import { Request } from "express";

type Payload= Pick<JwtPayload, "iss" |"sub" |"iat" |"exp">;
export function makeJWT(userID:string, expiresIn:number, secret:string):string{
const iat=Math.floor(Date.now()/1000);
const payload:  Payload={
iss:"webhook_db",
sub: userID,
iat,
exp:iat+expiresIn,
};
return jwt.sign(payload,secret);
}
export function validateJWT(tokenString:string, secret:string):string{
try{
const decoded=jwt.verify(tokenString,secret)as JwtPayload;
if(!decoded.sub){
throw new Error("Invalid token payload");
}
return decoded.sub;}
catch(err){
throw new Error("Invalid or expired token");
}
}
export function getBearerToken(req: Request): string {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    throw new  Error("Authorization header missing");
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw new  Error("Invalid authorization format");
  }

  const token = authHeader.replace("Bearer ", "").trim();

  if (!token) {
    throw new Error("Token missing");
  }

  return token;
}
export function makeRefreshToken(): string {
  return crypto.randomBytes(32).toString("hex");
}
export async function hashPassword(password:string):Promise<string>{
try{
const hash= await argon2.hash(password);
return hash;
}catch(err){
console.error(err);
return "unset";
}
}
export async function checkPasswordHash(password:string, hash:string):Promise<boolean>{
try{
if(await  argon2.verify(hash,password)){
return true;
}else{
return false;
}
}catch(err){
console.error(err);
return false;
}
}