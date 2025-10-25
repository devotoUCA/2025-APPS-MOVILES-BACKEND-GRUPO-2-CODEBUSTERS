-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TASKS" (
    "task_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "player_id" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL DEFAULT '',
    "tipo" TEXT NOT NULL DEFAULT 'Productividad',
    "completed_flag" BOOLEAN NOT NULL DEFAULT false,
    "eliminated_flag" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "TASKS_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "PLAYER" ("player_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TASKS" ("completed_flag", "eliminated_flag", "player_id", "task_id") SELECT "completed_flag", "eliminated_flag", "player_id", "task_id" FROM "TASKS";
DROP TABLE "TASKS";
ALTER TABLE "new_TASKS" RENAME TO "TASKS";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
