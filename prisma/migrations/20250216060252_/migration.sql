/*
  Warnings:

  - You are about to drop the column `availabile` on the `beds` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `beds` DROP COLUMN `availabile`,
    ADD COLUMN `available` BOOLEAN NOT NULL DEFAULT true;
