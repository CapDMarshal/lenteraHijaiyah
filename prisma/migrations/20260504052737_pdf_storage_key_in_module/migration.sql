/*
  Warnings:

  - Added the required column `pdfKey` to the `modules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "modules" ADD COLUMN     "pdfKey" TEXT NOT NULL;
