-- DropForeignKey
ALTER TABLE `patienttests` DROP FOREIGN KEY `PatientTests_patient_id_fkey`;

-- DropForeignKey
ALTER TABLE `prescription` DROP FOREIGN KEY `Prescription_patient_id_fkey`;

-- DropIndex
DROP INDEX `PatientTests_patient_id_fkey` ON `patienttests`;

-- DropIndex
DROP INDEX `Prescription_patient_id_fkey` ON `prescription`;

-- AlterTable
ALTER TABLE `patienttests` MODIFY `patient_id` VARCHAR(15) NOT NULL;

-- AlterTable
ALTER TABLE `prescription` MODIFY `patient_id` VARCHAR(15) NOT NULL;

-- AddForeignKey
ALTER TABLE `Prescription` ADD CONSTRAINT `Prescription_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `Patient`(`patient_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PatientTests` ADD CONSTRAINT `PatientTests_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `Patient`(`patient_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
