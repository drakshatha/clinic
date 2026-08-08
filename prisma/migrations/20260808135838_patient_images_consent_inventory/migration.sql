-- CreateTable
CREATE TABLE "PatientImage" (
    "id" TEXT NOT NULL,
    "patientPhone" TEXT NOT NULL,
    "label" TEXT NOT NULL DEFAULT '',
    "imageData" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PatientImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentForm" (
    "id" TEXT NOT NULL,
    "patientPhone" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "signatureData" TEXT NOT NULL DEFAULT '',
    "signedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsentForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "unit" TEXT NOT NULL DEFAULT 'pcs',
    "currentStock" INTEGER NOT NULL DEFAULT 0,
    "minStock" INTEGER NOT NULL DEFAULT 5,
    "costPerUnit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryLog" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "change" INTEGER NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "staffId" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PatientImage" ADD CONSTRAINT "PatientImage_patientPhone_fkey" FOREIGN KEY ("patientPhone") REFERENCES "Patient"("phone") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentForm" ADD CONSTRAINT "ConsentForm_patientPhone_fkey" FOREIGN KEY ("patientPhone") REFERENCES "Patient"("phone") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryLog" ADD CONSTRAINT "InventoryLog_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
