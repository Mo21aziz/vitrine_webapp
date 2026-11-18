-- CreateTable
CREATE TABLE `Avis` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `articleId` INTEGER NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `note` INTEGER NOT NULL,
    `commentaire` TEXT NOT NULL,
    `publie` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Avis_articleId_publie_idx`(`articleId`, `publie`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Avis` ADD CONSTRAINT `Avis_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

