-- CreateTable
CREATE TABLE "TourDate" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "tourId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TourDate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TourDate_tourId_idx" ON "TourDate"("tourId");

-- AddForeignKey
ALTER TABLE "TourDate" ADD CONSTRAINT "TourDate_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;
