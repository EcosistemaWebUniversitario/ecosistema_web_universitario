/*
  Warnings:

  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` ENUM('super_admin', 'admin_practicas', 'admin_prelocalizacion', 'estudiante', 'empresa') NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
