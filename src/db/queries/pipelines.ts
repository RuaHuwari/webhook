import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { pipelines } from "../schema.js";

export async function insertPipelineIntoDB(userId: number, name: string) {
  try {
    // Step 1: Insert pipeline without source_url
    const [pipeline] = await db.insert(pipelines)
      .values({ name:name, user_id: userId })
      .returning(); // returning the inserted row including id

    if (!pipeline?.id) {
      throw new Error("Failed to insert pipeline");
    }

    // Step 2: Update the source_url with the generated id
    const source_url = `/webhook/injest/${pipeline.id}`;
    const id= pipeline.id;
    const [updatedPipeline] = await db.update(pipelines)
      .set({ source_url })
      .where(eq(pipelines.id,id))
      .returning();

    return updatedPipeline;

  } catch (err) {
    console.error("Error inserting pipeline:", err);
    throw err;
  }
}
export async function checkPipelineBelongToUser(userId: number, pipelineId: number) {
  const result = await db
    .select()
    .from(pipelines)
    .where(eq(pipelines.id, pipelineId));

  if (result.length === 0) {
    return false;
  }

  return result[0].user_id === userId;
}
export async function getUserPipelines(userId:number){
  const result=await db.select().from(pipelines).where(eq(pipelines.user_id,userId));
  return result;
}