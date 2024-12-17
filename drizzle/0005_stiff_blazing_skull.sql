ALTER TABLE "analyzer_states" RENAME COLUMN "state_name" TO "analyzer_state_name";--> statement-breakpoint
ALTER TABLE "item_types" RENAME COLUMN "type_name" TO "item_type_name";--> statement-breakpoint
ALTER TABLE "analyzer_states" DROP CONSTRAINT "analyzer_states_state_name_unique";--> statement-breakpoint
ALTER TABLE "item_types" DROP CONSTRAINT "item_types_type_name_unique";--> statement-breakpoint
ALTER TABLE "analyzer_states" ADD CONSTRAINT "analyzer_states_analyzer_state_name_unique" UNIQUE("analyzer_state_name");--> statement-breakpoint
ALTER TABLE "item_types" ADD CONSTRAINT "item_types_item_type_name_unique" UNIQUE("item_type_name");