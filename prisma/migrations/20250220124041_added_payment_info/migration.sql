-- CreateTable
CREATE TABLE `Payment` (
    `payment_id` VARCHAR(20) NOT NULL,
    `patient_id` VARCHAR(15) NOT NULL,
    `payment_date` DATETIME(3) NOT NULL,
    `payment_method` VARCHAR(20) NOT NULL,
    `amount_paid` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`payment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Income` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(50) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `type` VARCHAR(10) NOT NULL DEFAULT 'income',
    `date` DATETIME(3) NOT NULL,
    `category` VARCHAR(50) NOT NULL,
    `description` VARCHAR(20) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Expense` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(50) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `type` VARCHAR(10) NOT NULL DEFAULT 'expense',
    `date` DATETIME(3) NOT NULL,
    `category` VARCHAR(50) NOT NULL,
    `description` VARCHAR(20) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `Patient`(`patient_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
