// import { unique } from 'drizzle-orm/gel-core';
import { pgTable, serial, text, varchar, integer, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  role: varchar('role', { length: 50 }).default('user'), // 'user' or 'admin'
  created_at: timestamp('created_at').defaultNow(),
});

export const pipelines = pgTable('pipelines', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => users.id),
  source_url:text('source_url').notNull().unique().default(''),
  name: varchar('name', { length: 255 }).notNull(),
  created_at: timestamp('created_at').defaultNow(),
});
export const actions = pgTable('actions',{
    id:serial('id').primaryKey(),
    action_name: varchar('action_name',{length:255}).notNull()
})
export const pipeline_actions= pgTable('pipeline_actions',{
    id: serial('id').primaryKey(),
    pipeline_id: integer('pipeline_id').notNull().references(()=>pipelines.id),
    action_id: integer('action_id').notNull().references(()=>actions.id),
});

export const jobs = pgTable('jobs', {
  id: serial('id').primaryKey(),
  pipeline_action_id: integer('pipeline_action_id').notNull().references(() => pipeline_actions.id),
  status: varchar('status', { length: 50 }).default('pending'),
  payload: jsonb('payload').notNull(),
  result: jsonb('result'),
  error: text('error'),
  created_at: timestamp('created_at').defaultNow(),
});

export const deliveries = pgTable('deliveries', {
  id: serial('id').primaryKey(),
  job_id: integer('job_id').notNull().references(() => jobs.id),
  subscriber_url: text('subscriber_url').notNull(),
  status: varchar('status', { length: 50 }).default('pending'), // success / failed / retry
  attempt_count: integer('attempt_count').default(0),
  created_at: timestamp('created_at').defaultNow(),
});
export const subscribers = pgTable('subscribers', {
  id: serial('id').primaryKey(),
  pipeline_id: integer('pipeline_id').notNull().references(() => pipelines.id),
  url: text('url').notNull(),
  created_at: timestamp('created_at').defaultNow(),
});
export type JOB=typeof jobs.$inferInsert;