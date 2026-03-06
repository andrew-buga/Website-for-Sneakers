/*
  Warnings:

  - You are about to drop the column `emailVerifyTokenExpiresAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerifyTokenExpiresAt";
