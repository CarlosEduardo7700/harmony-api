import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterObservationsNullableInLessons1750718061779
  implements MigrationInterface
{
  name = 'AlterObservationsNullableInLessons1750718061779';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lessons" ALTER COLUMN "observations" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lessons" ALTER COLUMN "observations" SET NOT NULL`,
    );
  }
}
