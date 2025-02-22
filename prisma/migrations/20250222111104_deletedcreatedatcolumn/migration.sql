/*
  Warnings:

  - You are about to drop the column `createdAt` on the `expense` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `income` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `expense` DROP COLUMN `createdAt`;

-- AlterTable
ALTER TABLE `income` DROP COLUMN `createdAt`;
