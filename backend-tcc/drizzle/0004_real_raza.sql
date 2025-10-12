ALTER TABLE "quizzes" ADD COLUMN "studied" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX "quizzes_studied_idx" ON "quizzes" USING btree ("studied");