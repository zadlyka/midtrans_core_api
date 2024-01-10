import { MigrationInterface, QueryRunner } from 'typeorm';

export class Order1704806900178 implements MigrationInterface {
  name = 'Order1704806900178';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "amount" integer NOT NULL, "status" character varying(16) NOT NULL DEFAULT 'pending', "paymentType" character varying(16) NOT NULL, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "order"`);
  }
}
