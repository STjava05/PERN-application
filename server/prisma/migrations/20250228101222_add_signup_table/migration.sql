-- AlterTable
ALTER TABLE "signup" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "signup_pkey" PRIMARY KEY ("id");
