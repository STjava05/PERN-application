-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100),
    "email" VARCHAR(100),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
