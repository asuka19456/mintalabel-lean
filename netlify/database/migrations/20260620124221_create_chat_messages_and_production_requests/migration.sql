CREATE TABLE "chat_messages" (
	"id" serial PRIMARY KEY,
	"department_factory" text NOT NULL,
	"line" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "production_requests" (
	"id" serial PRIMARY KEY,
	"department_factory" text NOT NULL,
	"line" text NOT NULL,
	"article_name" text NOT NULL,
	"destination" text NOT NULL,
	"week" text NOT NULL,
	"status" text DEFAULT 'wait' NOT NULL,
	"highlight" text DEFAULT 'NO' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
