/*
  Warnings:

  - The primary key for the `patientservice` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `patientservice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `patientservice` DROP PRIMARY KEY,
    DROP COLUMN `created_at`,
    ADD COLUMN `service_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD PRIMARY KEY (`patient_id`, `service_name`, `service_date`);
