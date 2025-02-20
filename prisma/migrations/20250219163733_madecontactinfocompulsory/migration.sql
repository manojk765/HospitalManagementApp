/*
  Warnings:

  - Made the column `contact` on table `opdpatient` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `opdpatient` MODIFY `contact` VARCHAR(10) NOT NULL;
