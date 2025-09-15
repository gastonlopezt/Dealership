/*
  Ensure existing roles are valid before shrinking the enum to only ADMIN.
  This avoids data truncation errors when altering the column.
*/
-- Data migration: coerce any non-ADMIN roles to ADMIN
UPDATE `user` SET `role` = 'ADMIN' WHERE `role` <> 'ADMIN';

-- Shrink enum to ADMIN only
ALTER TABLE `user` MODIFY `role` ENUM('ADMIN') NOT NULL DEFAULT 'ADMIN';

-- Add optional vehicle type
ALTER TABLE `vehicle` ADD COLUMN `type` ENUM('SEDAN', 'SUV', 'PICKUP', 'HATCHBACK') NULL;

-- Index for filtering by type
CREATE INDEX `vehicle_type_idx` ON `vehicle`(`type`);
