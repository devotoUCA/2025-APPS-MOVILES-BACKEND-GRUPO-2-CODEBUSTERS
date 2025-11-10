-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GardenProgress" (
    "player_id" INTEGER NOT NULL,
    "garden_id" INTEGER NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "progress" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("player_id", "garden_id"),
    CONSTRAINT "GardenProgress_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "PLAYER" ("player_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GardenProgress_garden_id_fkey" FOREIGN KEY ("garden_id") REFERENCES "GARDENS" ("garden_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_GardenProgress" ("garden_id", "level", "player_id") SELECT "garden_id", "level", "player_id" FROM "GardenProgress";
DROP TABLE "GardenProgress";
ALTER TABLE "new_GardenProgress" RENAME TO "GardenProgress";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
