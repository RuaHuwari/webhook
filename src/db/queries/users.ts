import {db} from "../index.js";
import {users} from "../schema.js";
import {eq} from 'drizzle-orm';
export async function createUser(email:string, hashed_password:string, role: 'user'|'admin'){
const [result]= await db.insert(users).values({email:email,password:hashed_password,role:role}).onConflictDoNothing().returning();
return result;
};
export async function getUserByEmail(email:string){
const result= await db.select().from(users).where(eq(users.email,email));
return result[0];
};
export async function isAdmin(userId:number){
    const result = await db.select().from(users).where(eq(users.id,userId));
    if(result[0].role ==="admin"){
        return true;
    }
    return false;
}
