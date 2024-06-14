import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserPhone1718372808523 implements MigrationInterface {
    name = 'AddUserPhone1718372808523'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
    }

}
