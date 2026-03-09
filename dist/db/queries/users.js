import { db } from "../index.js";
import { users } from "../schema.js";
import { eq } from 'drizzle-orm';
export async function createUser(email, hashed_password, role) {
    const [result] = await db.insert(users).values({ email: email, password: hashed_password, role: role }).onConflictDoNothing().returning();
    return result;
}
;
export async function getUserByEmail(email) {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
}
;
