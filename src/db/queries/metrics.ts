import { db } from "../index.js";
import { jobs, deliveries, pipelines, subscribers, pipeline_actions } from "../schema.js";
import { eq, inArray,count } from "drizzle-orm";
type JobMetrics = {
  totalJobs: number;
  pending: number;
  success: number;
  failed: number;
};

type DeliveryMetrics = {
  totalDeliveries: number;
  pending: number;
  success: number;
  failed: number;
  retriesPerSubscriber: { [subscriberUrl: string]: number };
};

type PipelineMetrics = {
  jobs: JobMetrics;
  deliveries: DeliveryMetrics;
  totalPipelines: number;
  totalSubscribers: number;
};

// -------------------- USER METRICS --------------------
export async function getUserMetrics(userId: number): Promise<PipelineMetrics> {
  // 1️⃣ Get pipelines owned by user
  const userPipelines = await db.select().from(pipelines).where(eq(pipelines.user_id, userId));
  const pipelineIds = userPipelines.map(p => p.id);

  // 2️⃣ Jobs metrics
  const jobsData = await db.select({
    status: jobs.status,
    count: count(jobs.id)
  })
  .from(jobs)
  .innerJoin(pipeline_actions, eq(pipeline_actions.id, jobs.pipeline_action_id))
  .innerJoin(pipelines,eq(pipelines.id,pipeline_actions.pipeline_id)) 
  .where(eq(pipelines.user_id,userId))
  .groupBy(jobs.status);

  const jobMetrics: JobMetrics = {
    totalJobs: 0,
    pending: 0,
    success: 0,
    failed: 0,
  };

  for (const j of jobsData) {
    jobMetrics.totalJobs += Number(j.count);
    if (j.status === "pending") jobMetrics.pending = Number(j.count);
    if (j.status === "success") jobMetrics.success = Number(j.count);
    if (j.status === "failed") jobMetrics.failed = Number(j.count);
  }

  // 3️⃣ Deliveries metrics
 const deliveriesData = await db.select({
  status: deliveries.status,
  subscriber_url: deliveries.subscriber_url,
  attempt_count: deliveries.attempt_count,
  count: count(deliveries.id)
})
.from(deliveries)
.innerJoin(jobs, eq(jobs.id, deliveries.job_id))
.innerJoin(pipeline_actions, eq(pipeline_actions.id, jobs.pipeline_action_id))
.where(inArray(pipeline_actions.pipeline_id, pipelineIds))
.groupBy(deliveries.status, deliveries.subscriber_url, deliveries.attempt_count);

  const deliveryMetrics: DeliveryMetrics = {
    totalDeliveries: 0,
    pending: 0,
    success: 0,
    failed: 0,
    retriesPerSubscriber: {}
  };

  for (const d of deliveriesData) {
    deliveryMetrics.totalDeliveries += Number(d.count);
    if (d.status === "pending") deliveryMetrics.pending += Number(d.count);
    if (d.status === "success") deliveryMetrics.success += Number(d.count);
    if (d.status === "failed") deliveryMetrics.failed += Number(d.count);

    deliveryMetrics.retriesPerSubscriber[d.subscriber_url] =
      (deliveryMetrics.retriesPerSubscriber[d.subscriber_url] || 0) + Number(d.attempt_count);
  }

  const totalSubscribers = await db.select().from(subscribers).where(inArray(subscribers.pipeline_id, pipelineIds)).then(res => res.length);

  return {
    jobs: jobMetrics,
    deliveries: deliveryMetrics,
    totalPipelines: pipelineIds.length,
    totalSubscribers
  };
}

// -------------------- ADMIN METRICS --------------------
export async function getAdminMetrics(): Promise<PipelineMetrics> {
  // Admin sees everything
  const pipelineIds = (await db.select().from(pipelines)).map(p => p.id);

  return getUserMetricsForPipelineIds(pipelineIds);
}

// Helper to reuse logic
async function getUserMetricsForPipelineIds(pipelineIds: number[]): Promise<PipelineMetrics> {
  // 2️⃣ Jobs metrics
  const jobsData = await db.select({
    status: jobs.status,
    count: count(jobs.id)
  })
  .from(jobs)
  .groupBy(jobs.status);

  const jobMetrics: JobMetrics = {
    totalJobs: 0,
    pending: 0,
    success: 0,
    failed: 0,
  };

  for (const j of jobsData) {
    jobMetrics.totalJobs += Number(j.count);
    if (j.status === "pending") jobMetrics.pending = Number(j.count);
    if (j.status === "success") jobMetrics.success = Number(j.count);
    if (j.status === "failed") jobMetrics.failed = Number(j.count);
  }

  // 3️⃣ Deliveries metrics
 const deliveriesData = await db.select({
  status: deliveries.status,
  subscriber_url: deliveries.subscriber_url,
  attempt_count: deliveries.attempt_count,
  count: count(deliveries.id)
})
.from(deliveries)
.innerJoin(jobs, eq(jobs.id, deliveries.job_id))
.innerJoin(pipeline_actions, eq(pipeline_actions.id, jobs.pipeline_action_id))
.where(inArray(pipeline_actions.pipeline_id, pipelineIds))
.groupBy(deliveries.status, deliveries.subscriber_url, deliveries.attempt_count);

  const deliveryMetrics: DeliveryMetrics = {
    totalDeliveries: 0,
    pending: 0,
    success: 0,
    failed: 0,
    retriesPerSubscriber: {}
  };

  for (const d of deliveriesData) {
    deliveryMetrics.totalDeliveries += Number(d.count);
    if (d.status === "pending") deliveryMetrics.pending += Number(d.count);
    if (d.status === "success") deliveryMetrics.success += Number(d.count);
    if (d.status === "failed") deliveryMetrics.failed += Number(d.count);

    deliveryMetrics.retriesPerSubscriber[d.subscriber_url] =
      (deliveryMetrics.retriesPerSubscriber[d.subscriber_url] || 0) + Number(d.attempt_count);
  }

  const totalSubscribers = await db.select().from(subscribers).then(res => res.length);

  return {
    jobs: jobMetrics,
    deliveries: deliveryMetrics,
    totalPipelines: pipelineIds.length,
    totalSubscribers
  };
}