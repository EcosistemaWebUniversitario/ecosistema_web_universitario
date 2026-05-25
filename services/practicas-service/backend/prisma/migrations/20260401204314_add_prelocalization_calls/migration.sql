-- CreateTable
CREATE TABLE `PrelocalizationCall` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `careerId` INTEGER NOT NULL,
    `academicYear` INTEGER NOT NULL,
    `status` ENUM('OPEN', 'CLOSED') NOT NULL DEFAULT 'OPEN',
    `createdBy` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PrelocalizationRanking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `prelocalizationCallId` INTEGER NOT NULL,
    `studentId` INTEGER NOT NULL,
    `position` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PrelocalizationRanking_prelocalizationCallId_studentId_key`(`prelocalizationCallId`, `studentId`),
    UNIQUE INDEX `PrelocalizationRanking_prelocalizationCallId_position_key`(`prelocalizationCallId`, `position`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PrelocalizationAssignment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `prelocalizationCallId` INTEGER NOT NULL,
    `studentId` INTEGER NOT NULL,
    `vacancyId` INTEGER NOT NULL,
    `academicYear` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PrelocalizationAssignment_prelocalizationCallId_studentId_key`(`prelocalizationCallId`, `studentId`),
    UNIQUE INDEX `PrelocalizationAssignment_prelocalizationCallId_vacancyId_key`(`prelocalizationCallId`, `vacancyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PrelocalizationCall` ADD CONSTRAINT `PrelocalizationCall_careerId_fkey` FOREIGN KEY (`careerId`) REFERENCES `Career`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PrelocalizationCall` ADD CONSTRAINT `PrelocalizationCall_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PrelocalizationRanking` ADD CONSTRAINT `PrelocalizationRanking_prelocalizationCallId_fkey` FOREIGN KEY (`prelocalizationCallId`) REFERENCES `PrelocalizationCall`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PrelocalizationRanking` ADD CONSTRAINT `PrelocalizationRanking_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PrelocalizationAssignment` ADD CONSTRAINT `PrelocalizationAssignment_prelocalizationCallId_fkey` FOREIGN KEY (`prelocalizationCallId`) REFERENCES `PrelocalizationCall`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PrelocalizationAssignment` ADD CONSTRAINT `PrelocalizationAssignment_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PrelocalizationAssignment` ADD CONSTRAINT `PrelocalizationAssignment_vacancyId_fkey` FOREIGN KEY (`vacancyId`) REFERENCES `Vacancy`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
