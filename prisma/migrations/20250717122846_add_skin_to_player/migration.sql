-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "skinId" INTEGER;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_skinId_fkey" FOREIGN KEY ("skinId") REFERENCES "Skin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
