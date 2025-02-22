/*
  Warnings:

  - You are about to drop the column `dischared` on the `payment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `payment` DROP COLUMN `dischared`,
    ADD COLUMN `discharged` BOOLEAN NOT NULL DEFAULT false;
