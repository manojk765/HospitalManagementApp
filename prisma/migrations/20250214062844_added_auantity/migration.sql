/*
  Warnings:

  - The primary key for the `patientsurgery` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `patienttests` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `patientsurgery` DROP PRIMARY KEY,
    ADD COLUMN `quantity` INTEGER NOT NULL DEFAULT 0,
    ADD PRIMARY KEY (`patient_id`, `surgery_name`, `surgery_date`);

-- AlterTable
ALTER TABLE `patienttests` DROP PRIMARY KEY,
    ADD COLUMN `quantity` INTEGER NOT NULL DEFAULT 0,
    ADD PRIMARY KEY (`patient_id`, `test_name`, `test_date`);
