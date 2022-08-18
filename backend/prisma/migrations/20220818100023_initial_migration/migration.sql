-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "ChimeraPillar" (
    "id" BIGSERIAL NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "ChimeraPillar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TraitType" (
    "id" BIGSERIAL NOT NULL,
    "trait_type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "chimeraPillarId" BIGINT NOT NULL,

    CONSTRAINT "TraitType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChimeraPillarMerge" (
    "id" BIGSERIAL NOT NULL,
    "baseChimeraPillarId" BIGINT NOT NULL,
    "burnChimeraPillarId" BIGINT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "traitTypeIds" INTEGER[],

    CONSTRAINT "ChimeraPillarMerge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChimeraPillar_tokenId_key" ON "ChimeraPillar"("tokenId");

-- AddForeignKey
ALTER TABLE "TraitType" ADD CONSTRAINT "TraitType_chimeraPillarId_fkey" FOREIGN KEY ("chimeraPillarId") REFERENCES "ChimeraPillar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
