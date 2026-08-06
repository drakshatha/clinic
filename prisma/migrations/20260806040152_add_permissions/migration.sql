-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "permissions" TEXT NOT NULL DEFAULT '[]';

-- AlterTable
ALTER TABLE "StaffUser" ADD COLUMN     "isOwner" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "permissions" TEXT NOT NULL DEFAULT '[]';
