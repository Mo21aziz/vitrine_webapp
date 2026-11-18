-- Admins now sign in with a username instead of an email.
-- Rename (not drop) so existing admin rows are kept.
ALTER TABLE `Admin` RENAME COLUMN `email` TO `username`;
ALTER TABLE `Admin` RENAME INDEX `Admin_email_key` TO `Admin_username_key`;
