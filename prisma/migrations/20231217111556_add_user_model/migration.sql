/*
  Warnings:

  - You are about to drop the column `authorId` on the `schedule` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `schedule` DROP FOREIGN KEY `Schedule_authorId_fkey`;

-- AlterTable
ALTER TABLE `schedule` DROP COLUMN `authorId`,
    ADD COLUMN `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
