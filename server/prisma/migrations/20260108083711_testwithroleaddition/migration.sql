/*
  Warnings:

  - You are about to drop the column `clientId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `user` table. All the data in the column will be lost.
  - You are about to alter the column `role` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - A unique constraint covering the columns `[userId]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Loan_bookId_fkey` ON `loan`;

-- DropIndex
DROP INDEX `Loan_clientId_fkey` ON `loan`;

-- DropIndex
DROP INDEX `User_clientId_key` ON `user`;

-- AlterTable
ALTER TABLE `client` ADD COLUMN `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `clientId`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    MODIFY `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER';

-- CreateIndex
CREATE UNIQUE INDEX `Client_userId_key` ON `Client`(`userId`);

-- AddForeignKey
ALTER TABLE `Client` ADD CONSTRAINT `Client_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Loan` ADD CONSTRAINT `Loan_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `Book`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Loan` ADD CONSTRAINT `Loan_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
