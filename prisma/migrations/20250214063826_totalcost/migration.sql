-- AlterTable
ALTER TABLE `patientsurgery` ADD COLUMN `total_cost` DECIMAL(10, 2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `patienttests` ADD COLUMN `total_cost` DECIMAL(10, 2) NOT NULL DEFAULT 0;
