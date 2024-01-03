/*
  Warnings:

  - You are about to drop the column `userId` on the `schedule` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `schedule` DROP FOREIGN KEY `Schedule_userId_fkey`;

-- AlterTable
ALTER TABLE `schedule` DROP COLUMN `userId`;

-- CreateTable
CREATE TABLE `userSchedule` (
    `userId` INTEGER NOT NULL,
    `scheduleId` INTEGER NOT NULL,

    PRIMARY KEY (`userId`, `scheduleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `userSchedule` ADD CONSTRAINT `userSchedule_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userSchedule` ADD CONSTRAINT `userSchedule_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `Schedule`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
