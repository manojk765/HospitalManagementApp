-- CreateTable
CREATE TABLE `PatientAdmissionFee` (
    `patient_id` VARCHAR(15) NOT NULL,
    `room_id` INTEGER NOT NULL,
    `admittedDate` DATETIME(3) NOT NULL,
    `dischargeDate` DATETIME(3) NOT NULL,
    `totalDays` INTEGER NOT NULL,
    `totalCost` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`patient_id`, `room_id`, `admittedDate`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PatientAdmissionFee` ADD CONSTRAINT `PatientAdmissionFee_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `Patient`(`patient_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PatientAdmissionFee` ADD CONSTRAINT `PatientAdmissionFee_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `Beds`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
