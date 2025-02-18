-- AddForeignKey
ALTER TABLE `Admission` ADD CONSTRAINT `Admission_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `Patient`(`patient_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Admission` ADD CONSTRAINT `Admission_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `Beds`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
