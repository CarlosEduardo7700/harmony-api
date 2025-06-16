import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1750111649867 implements MigrationInterface {
  name = 'CreateTables1750111649867';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "lessons" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "google_event_id" character varying(100) NOT NULL, "google_event_link" character varying(210) NOT NULL, "title" character varying(100) NOT NULL, "start_time" character varying NOT NULL, "end_time" character varying NOT NULL, "lesson_date" date NOT NULL, "observations" character varying(500) NOT NULL, "created_at" character varying, "updated_at" character varying, "deleted_at" character varying, CONSTRAINT "PK_9b9a8d455cac672d262d7275730" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "lessons"`);
  }
}
