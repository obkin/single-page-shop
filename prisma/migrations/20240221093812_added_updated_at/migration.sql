/*
  Warnings:

  - Added the required column `updatedAt` to the `CommentModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PostModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `UserModel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CommentModel" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "PostModel" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "UserModel" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
