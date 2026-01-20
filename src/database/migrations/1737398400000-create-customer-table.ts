import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCustomerTable1737398400000 implements MigrationInterface {
  name = 'CreateCustomerTable1737398400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "customers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "full_name" character varying(255) NOT NULL,
        "email" character varying(255) NOT NULL,
        "phone_number" character varying(50) NOT NULL,
        "national_id" character varying(100) NOT NULL,
        "internal_notes" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_customer_email" UNIQUE ("email"),
        CONSTRAINT "PK_customers" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_customers_full_name" ON "customers" ("full_name")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_customers_email" ON "customers" ("email")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_customers_created_at" ON "customers" ("created_at")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_customers_created_at"`);
    await queryRunner.query(`DROP INDEX "IDX_customers_email"`);
    await queryRunner.query(`DROP INDEX "IDX_customers_full_name"`);
    await queryRunner.query(`DROP TABLE "customers"`);
  }
}
