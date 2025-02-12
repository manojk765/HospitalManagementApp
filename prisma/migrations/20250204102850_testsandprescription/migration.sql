-- CreateTable
CREATE TABLE `PatientService` (
    `service_id` INTEGER NOT NULL AUTO_INCREMENT,
    `patient_id` VARCHAR(15) NOT NULL,
    `service_name` VARCHAR(100) NOT NULL,
    `service_type` ENUM('Hospital', 'Consultation', 'Surgery', 'Diagnostic', 'Therapy', 'Medication', 'Other') NOT NULL,
    `cost` DECIMAL(10, 2) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `total_cost` DECIMAL(10, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PatientService_patient_id_idx`(`patient_id`),
    PRIMARY KEY (`service_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Prescription` (
    `prescription_id` INTEGER NOT NULL AUTO_INCREMENT,
    `patient_id` VARCHAR(10) NOT NULL,
    `doctor_id` INTEGER NOT NULL,
    `prescription_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `medicine_name` VARCHAR(100) NOT NULL,
    `dosage` VARCHAR(100) NOT NULL,
    `duration` VARCHAR(50) NOT NULL,
    `duration_type` VARCHAR(50) NOT NULL,
    `is_paid` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`prescription_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PatientTests` (
    `result_id` INTEGER NOT NULL AUTO_INCREMENT,
    `patient_id` VARCHAR(10) NOT NULL,
    `test_name` VARCHAR(100) NOT NULL,
    `test_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `result_description` TEXT NOT NULL,
    `doctor_id` INTEGER NOT NULL,
    `is_paid` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`result_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PatientService` ADD CONSTRAINT `PatientService_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `Patient`(`patient_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Prescription` ADD CONSTRAINT `Prescription_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `Patient`(`patient_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Prescription` ADD CONSTRAINT `Prescription_doctor_id_fkey` FOREIGN KEY (`doctor_id`) REFERENCES `Doctor`(`doctor_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PatientTests` ADD CONSTRAINT `PatientTests_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `Patient`(`patient_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PatientTests` ADD CONSTRAINT `PatientTests_doctor_id_fkey` FOREIGN KEY (`doctor_id`) REFERENCES `Doctor`(`doctor_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PatientTests` ADD CONSTRAINT `PatientTests_test_name_fkey` FOREIGN KEY (`test_name`) REFERENCES `LabTest`(`test_name`) ON DELETE RESTRICT ON UPDATE CASCADE;
