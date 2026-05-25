/*
  Warnings:

  - Added the required column `specialty` to the `Agreement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentsNeeded` to the `Agreement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Agreement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `agreement` ADD COLUMN `approvedByPractices` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `approvedByPrelocation` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `bankProblemDocument` VARCHAR(191) NULL,
    ADD COLUMN `specialty` VARCHAR(191) NOT NULL,
    ADD COLUMN `studentsNeeded` INTEGER NOT NULL,
    ADD COLUMN `type` ENUM('PRACTICE', 'PRELOCATION', 'BOTH') NOT NULL;
