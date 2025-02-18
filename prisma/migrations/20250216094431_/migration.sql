/*
  Warnings:

  - A unique constraint covering the columns `[type,bedNumber]` on the table `Beds` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Beds_type_bedNumber_key` ON `Beds`(`type`, `bedNumber`);
