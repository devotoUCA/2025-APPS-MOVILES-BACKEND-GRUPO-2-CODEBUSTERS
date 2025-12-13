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
    "completed_at" DATETIME,
    "deadline" DATETIME,
    "failed_flag" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "TASKS_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "PLAYER" ("player_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TASKS" ("completed_at", "completed_flag", "eliminated_flag", "player_id", "task_id", "tipo", "titulo") SELECT "completed_at", "completed_flag", "eliminated_flag", "player_id", "task_id", "tipo", "titulo" FROM "TASKS";
DROP TABLE "TASKS";
ALTER TABLE "new_TASKS" RENAME TO "TASKS";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
