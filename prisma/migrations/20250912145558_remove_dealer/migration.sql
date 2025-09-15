/*
  Warnings:

  - You are about to drop the column `dealerId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `dealerId` on the `vehicle` table. All the data in the column will be lost.
  - You are about to drop the `dealer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_dealerId_fkey`;

-- DropForeignKey
ALTER TABLE `vehicle` DROP FOREIGN KEY `Vehicle_dealerId_fkey`;

-- DropIndex
DROP INDEX `User_dealerId_fkey` ON `user`;

-- DropIndex
DROP INDEX `Vehicle_dealerId_make_model_year_idx` ON `vehicle`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `dealerId`;

-- AlterTable
ALTER TABLE `vehicle` DROP COLUMN `dealerId`;

-- DropTable
DROP TABLE `dealer`;

-- CreateIndex
CREATE INDEX `Vehicle_make_model_year_idx` ON `Vehicle`(`make`, `model`, `year`);

-- RenameIndex
ALTER TABLE `vehicle` RENAME INDEX `vehicle_type_idx` TO `Vehicle_type_idx`;
