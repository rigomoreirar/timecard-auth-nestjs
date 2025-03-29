/*
  Warnings:

  - You are about to drop the column `clientSecret` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "clientSecret",
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
