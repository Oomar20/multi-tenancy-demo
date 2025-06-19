-- CreateTable
CREATE TABLE "UserGrade" (
    "userId" TEXT NOT NULL,
    "gradeId" TEXT NOT NULL,

    CONSTRAINT "UserGrade_pkey" PRIMARY KEY ("userId","gradeId")
);

-- CreateIndex
CREATE INDEX "UserGrade_gradeId_idx" ON "UserGrade"("gradeId");

-- AddForeignKey
ALTER TABLE "UserGrade" ADD CONSTRAINT "UserGrade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGrade" ADD CONSTRAINT "UserGrade_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
