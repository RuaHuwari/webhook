ALTER TABLE "pipelines" ADD COLUMN "source_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "pipeline_actions" DROP COLUMN "priority";--> statement-breakpoint
ALTER TABLE "pipelines" DROP COLUMN "priority";--> statement-breakpoint
ALTER TABLE "pipelines" ADD CONSTRAINT "pipelines_source_url_unique" UNIQUE("source_url");