-- CreateTable
CREATE TABLE `Beds` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('GeneralWard', 'SemiPrivate', 'Private', 'ICU') NOT NULL,
    `bedNumber` VARCHAR(10) NOT NULL,
    `dailyRate` DECIMAL(10, 2) NOT NULL,
    `availabile` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admission` (
    `patient_id` VARCHAR(15) NOT NULL,
    `room_id` INTEGER NOT NULL,
    `admittedDate` DATETIME(3) NOT NULL,
    `dischargeDate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`patient_id`, `room_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
