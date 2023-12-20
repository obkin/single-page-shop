-- CreateTable
CREATE TABLE "PostModel" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,

    CONSTRAINT "PostModel_pkey" PRIMARY KEY ("id")
);
