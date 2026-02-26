-- CreateTable
CREATE TABLE "InstructorAvailability" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "instructorId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InstructorAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InstructorAvailability_tenantId_idx" ON "InstructorAvailability"("tenantId");

-- CreateIndex
CREATE INDEX "InstructorAvailability_instructorId_idx" ON "InstructorAvailability"("instructorId");
