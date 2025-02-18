-- CreateTable
CREATE TABLE `Birth` (
    `birth_id` VARCHAR(15) NOT NULL,
    `patient_id` VARCHAR(15) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `fatherName` VARCHAR(100) NOT NULL,
    `gender` ENUM('Male', 'Female', 'Other') NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `typeofDelivery` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`birth_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Birth` ADD CONSTRAINT `Birth_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `Patient`(`patient_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
