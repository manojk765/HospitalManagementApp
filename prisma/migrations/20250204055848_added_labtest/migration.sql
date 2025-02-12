-- CreateTable
CREATE TABLE `LabTest` (
    `test_name` VARCHAR(100) NOT NULL,
    `cost` DECIMAL(10, 2) NOT NULL,
    `description` TEXT NOT NULL,

    PRIMARY KEY (`test_name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
