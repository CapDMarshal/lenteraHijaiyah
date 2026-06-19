/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `modules` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `modules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "modules" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "modules_slug_key" ON "modules"("slug");
