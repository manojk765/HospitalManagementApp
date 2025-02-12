/*
  Warnings:

  - The primary key for the `department` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `department_id` on the `department` table. All the data in the column will be lost.
  - You are about to drop the column `department_id` on the `doctor` table. All the data in the column will be lost.
  - You are about to drop the column `department_id` on the `staff` table. All the data in the column will be lost.
  - Added the required column `department_name` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department_name` to the `Staff` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `doctor` DROP FOREIGN KEY `Doctor_department_id_fkey`;

-- DropForeignKey
ALTER TABLE `staff` DROP FOREIGN KEY `Staff_department_id_fkey`;

-- DropIndex
DROP INDEX `Doctor_department_id_fkey` ON `doctor`;

-- DropIndex
DROP INDEX `Staff_department_id_fkey` ON `staff`;

-- AlterTable
ALTER TABLE `department` DROP PRIMARY KEY,
    DROP COLUMN `department_id`,
    ADD PRIMARY KEY (`department_name`);

-- AlterTable
ALTER TABLE `doctor` DROP COLUMN `department_id`,
    ADD COLUMN `department_name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `staff` DROP COLUMN `department_id`,
    ADD COLUMN `department_name` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Doctor` ADD CONSTRAINT `Doctor_department_name_fkey` FOREIGN KEY (`department_name`) REFERENCES `Department`(`department_name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Staff` ADD CONSTRAINT `Staff_department_name_fkey` FOREIGN KEY (`department_name`) REFERENCES `Department`(`department_name`) ON DELETE RESTRICT ON UPDATE CASCADE;
