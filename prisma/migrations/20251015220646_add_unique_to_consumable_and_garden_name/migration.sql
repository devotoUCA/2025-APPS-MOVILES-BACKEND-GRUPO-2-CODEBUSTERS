/*
  Warnings:

  - A unique constraint covering the columns `[consumable_name]` on the table `CONSUMABLES` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[garden_name]` on the table `GARDENS` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CONSUMABLES_consumable_name_key" ON "CONSUMABLES"("consumable_name");

-- CreateIndex
CREATE UNIQUE INDEX "GARDENS_garden_name_key" ON "GARDENS"("garden_name");
