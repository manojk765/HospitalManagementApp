/*
  Warnings:

  - You are about to drop the `doctor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `doctor`;

-- CreateTable
CREATE TABLE `Manufacturer` (
    `vendor_id` INTEGER NOT NULL AUTO_INCREMENT,
    `vendor_pharm_name` VARCHAR(191) NULL,
    `vendor_name` VARCHAR(191) NOT NULL,
    `contact_number` VARCHAR(10) NOT NULL,
    `email` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `zip_code` VARCHAR(10) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Manufacturer_email_key`(`email`),
    PRIMARY KEY (`vendor_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Medicine` (
    `medicine_id` INTEGER NOT NULL AUTO_INCREMENT,
    `medicine_name` VARCHAR(191) NOT NULL,
    `stock_quantity` INTEGER NOT NULL,
    `price_per_unit` DECIMAL(10, 2) NOT NULL,
    `unit_quantity` DECIMAL(10, 2) NOT NULL,
    `batch_number` VARCHAR(191) NOT NULL,
    `expiry_date` DATETIME(3) NOT NULL,
    `manufacturer_id` INTEGER NOT NULL,

    UNIQUE INDEX `Medicine_medicine_name_manufacturer_id_key`(`medicine_name`, `manufacturer_id`),
    PRIMARY KEY (`medicine_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Medicine` ADD CONSTRAINT `Medicine_manufacturer_id_fkey` FOREIGN KEY (`manufacturer_id`) REFERENCES `Manufacturer`(`vendor_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
