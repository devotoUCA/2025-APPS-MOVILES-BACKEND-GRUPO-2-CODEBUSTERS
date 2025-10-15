-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CONSUMABLES" (
    "consumable_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "consumable_name" TEXT NOT NULL,
    "consumable_img" TEXT
);
INSERT INTO "new_CONSUMABLES" ("consumable_id", "consumable_img", "consumable_name") SELECT "consumable_id", "consumable_img", "consumable_name" FROM "CONSUMABLES";
DROP TABLE "CONSUMABLES";
ALTER TABLE "new_CONSUMABLES" RENAME TO "CONSUMABLES";
CREATE UNIQUE INDEX "CONSUMABLES_consumable_name_key" ON "CONSUMABLES"("consumable_name");
CREATE TABLE "new_GARDENS" (
    "garden_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "garden_name" TEXT NOT NULL,
    "level_1_img" TEXT,
    "level_2_img" TEXT,
    "level_3_img" TEXT,
    "level_4_img" TEXT,
    "level_5_img" TEXT
);
INSERT INTO "new_GARDENS" ("garden_id", "garden_name", "level_1_img", "level_2_img", "level_3_img", "level_4_img", "level_5_img") SELECT "garden_id", "garden_name", "level_1_img", "level_2_img", "level_3_img", "level_4_img", "level_5_img" FROM "GARDENS";
DROP TABLE "GARDENS";
ALTER TABLE "new_GARDENS" RENAME TO "GARDENS";
CREATE UNIQUE INDEX "GARDENS_garden_name_key" ON "GARDENS"("garden_name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
