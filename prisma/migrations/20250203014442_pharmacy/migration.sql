/*
  Warnings:

  - The primary key for the `manufacturer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `vendor_id` on the `manufacturer` table. All the data in the column will be lost.
  - You are about to drop the column `manufacturer_id` on the `medicine` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[medicine_name,manufacturer_name]` on the table `Medicine` will be added. If there are existing duplicate values, this will fail.
  - Made the column `vendor_pharm_name` on table `manufacturer` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `manufacturer_name` to the `Medicine` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `medicine` DROP FOREIGN KEY `Medicine_manufacturer_id_fkey`;

-- DropIndex
DROP INDEX `Medicine_manufacturer_id_fkey` ON `medicine`;

-- DropIndex
DROP INDEX `Medicine_medicine_name_manufacturer_id_key` ON `medicine`;

-- AlterTable
ALTER TABLE `manufacturer` DROP PRIMARY KEY,
    DROP COLUMN `vendor_id`,
    MODIFY `vendor_pharm_name` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`vendor_pharm_name`);

-- AlterTable
ALTER TABLE `medicine` DROP COLUMN `manufacturer_id`,
    ADD COLUMN `manufacturer_name` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Medicine_medicine_name_manufacturer_name_key` ON `Medicine`(`medicine_name`, `manufacturer_name`);

-- AddForeignKey
ALTER TABLE `Medicine` ADD CONSTRAINT `Medicine_manufacturer_name_fkey` FOREIGN KEY (`manufacturer_name`) REFERENCES `Manufacturer`(`vendor_pharm_name`) ON DELETE RESTRICT ON UPDATE CASCADE;
