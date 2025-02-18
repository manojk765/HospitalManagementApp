/*
  Warnings:

  - The primary key for the `admission` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `admission` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`patient_id`, `room_id`, `admittedDate`);
