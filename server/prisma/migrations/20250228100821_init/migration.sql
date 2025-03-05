-- CreateTable
CREATE TABLE "signup" (
    "name" VARCHAR(100),
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100)
);

-- CreateIndex
CREATE UNIQUE INDEX "signup_email_key" ON "signup"("email");
