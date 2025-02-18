/*
  Warnings:

  - The primary key for the `doctor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `patientservice` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cost` on the `patientservice` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `patientservice` table. All the data in the column will be lost.
  - You are about to drop the column `service_id` on the `patientservice` table. All the data in the column will be lost.
  - You are about to drop the column `service_type` on the `patientservice` table. All the data in the column will be lost.
  - The primary key for the `patienttests` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `result_id` on the `patienttests` table. All the data in the column will be lost.
  - The primary key for the `staff` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `patienttests` DROP FOREIGN KEY `PatientTests_doctor_id_fkey`;

-- DropForeignKey
ALTER TABLE `prescription` DROP FOREIGN KEY `Prescription_doctor_id_fkey`;

-- DropIndex
DROP INDEX `PatientTests_doctor_id_fkey` ON `patienttests`;

-- DropIndex
DROP INDEX `Prescription_doctor_id_fkey` ON `prescription`;

-- AlterTable
ALTER TABLE `doctor` DROP PRIMARY KEY,
    MODIFY `doctor_id` VARCHAR(15) NOT NULL,
    ADD PRIMARY KEY (`doctor_id`);

-- AlterTable
ALTER TABLE `patientservice` DROP PRIMARY KEY,
    DROP COLUMN `cost`,
    DROP COLUMN `created_at`,
    DROP COLUMN `service_id`,
    DROP COLUMN `service_type`,
    ADD COLUMN `is_paid` BOOLEAN NOT NULL DEFAULT false,
    ADD PRIMARY KEY (`patient_id`, `service_name`);

-- AlterTable
ALTER TABLE `patienttests` DROP PRIMARY KEY,
    DROP COLUMN `result_id`,
    MODIFY `doctor_id` VARCHAR(15) NOT NULL,
    ADD PRIMARY KEY (`patient_id`, `test_name`);

-- AlterTable
ALTER TABLE `prescription` MODIFY `doctor_id` VARCHAR(15) NOT NULL;

-- AlterTable
ALTER TABLE `staff` DROP PRIMARY KEY,
    MODIFY `staff_id` VARCHAR(15) NOT NULL,
    ADD PRIMARY KEY (`staff_id`);

-- CreateTable
CREATE TABLE `Services` (
    `service_name` VARCHAR(100) NOT NULL,
    `cost` DECIMAL(10, 2) NOT NULL,
    `description` TEXT NOT NULL,

    PRIMARY KEY (`service_name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Surgery` (
    `surgery_name` VARCHAR(100) NOT NULL,
    `cost` DECIMAL(10, 2) NOT NULL,
    `description` TEXT NOT NULL,

    PRIMARY KEY (`surgery_name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PatientSurgery` (
    `patient_id` VARCHAR(15) NOT NULL,
    `surgery_name` VARCHAR(100) NOT NULL,
    `surgery_date` DATETIME(3) NOT NULL,
    `surgery_description` TEXT NOT NULL,
    `doctor_id` VARCHAR(15) NOT NULL,
    `is_paid` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`patient_id`, `surgery_name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Prescription` ADD CONSTRAINT `Prescription_doctor_id_fkey` FOREIGN KEY (`doctor_id`) REFERENCES `Doctor`(`doctor_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PatientService` ADD CONSTRAINT `PatientService_service_name_fkey` FOREIGN KEY (`service_name`) REFERENCES `Services`(`service_name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PatientTests` ADD CONSTRAINT `PatientTests_doctor_id_fkey` FOREIGN KEY (`doctor_id`) REFERENCES `Doctor`(`doctor_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PatientSurgery` ADD CONSTRAINT `PatientSurgery_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `Patient`(`patient_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PatientSurgery` ADD CONSTRAINT `PatientSurgery_surgery_name_fkey` FOREIGN KEY (`surgery_name`) REFERENCES `Surgery`(`surgery_name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PatientSurgery` ADD CONSTRAINT `PatientSurgery_doctor_id_fkey` FOREIGN KEY (`doctor_id`) REFERENCES `Doctor`(`doctor_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
