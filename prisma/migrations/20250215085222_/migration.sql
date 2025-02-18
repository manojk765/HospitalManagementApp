/*
  Warnings:

  - You are about to drop the column `doctor_id` on the `patientsurgery` table. All the data in the column will be lost.
  - You are about to drop the column `doctor_id` on the `patienttests` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `patientsurgery` DROP FOREIGN KEY `PatientSurgery_doctor_id_fkey`;

-- DropForeignKey
ALTER TABLE `patienttests` DROP FOREIGN KEY `PatientTests_doctor_id_fkey`;

-- DropIndex
DROP INDEX `PatientSurgery_doctor_id_fkey` ON `patientsurgery`;

-- DropIndex
DROP INDEX `PatientTests_doctor_id_fkey` ON `patienttests`;

-- AlterTable
ALTER TABLE `patientsurgery` DROP COLUMN `doctor_id`;

-- AlterTable
ALTER TABLE `patienttests` DROP COLUMN `doctor_id`;

-- CreateTable
CREATE TABLE `PatientDoctor` (
    `patient_id` VARCHAR(15) NOT NULL,
    `doctor_id` VARCHAR(15) NOT NULL,

    PRIMARY KEY (`patient_id`, `doctor_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PatientDoctor` ADD CONSTRAINT `PatientDoctor_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `Patient`(`patient_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PatientDoctor` ADD CONSTRAINT `PatientDoctor_doctor_id_fkey` FOREIGN KEY (`doctor_id`) REFERENCES `Doctor`(`doctor_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
