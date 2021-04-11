/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[stripeCustomerId]` on the table `User`. If there are existing duplicate values, the migration will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "stripeCustomerId" TEXT;
ALTER TABLE "User" ADD COLUMN "price" TEXT;
ALTER TABLE "User" ADD COLUMN "subscriptionStatus" TEXT DEFAULT 'incomplete';

-- CreateIndex
CREATE UNIQUE INDEX "User.stripeCustomerId_unique" ON "User"("stripeCustomerId");
