-- CreateTable
CREATE TABLE "PLAYER" (
    "player_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "player_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "current_garden_id" INTEGER,
    "current_garden_level" INTEGER,
    CONSTRAINT "PLAYER_current_garden_id_fkey" FOREIGN KEY ("current_garden_id") REFERENCES "GARDENS" ("garden_id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GARDENS" (
    "garden_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "garden_name" TEXT NOT NULL,
    "level_1_img" TEXT,
    "level_2_img" TEXT,
    "level_3_img" TEXT,
    "level_4_img" TEXT,
    "level_5_img" TEXT
);

-- CreateTable
CREATE TABLE "CONSUMABLES" (
    "consumable_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "consumable_name" TEXT NOT NULL,
    "consumable_img" TEXT
);

-- CreateTable
CREATE TABLE "INVENTORY" (
    "player_id" INTEGER NOT NULL,
    "consumable_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("player_id", "consumable_id"),
    CONSTRAINT "INVENTORY_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "PLAYER" ("player_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "INVENTORY_consumable_id_fkey" FOREIGN KEY ("consumable_id") REFERENCES "CONSUMABLES" ("consumable_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TASKS" (
    "task_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "player_id" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL DEFAULT '',
    "tipo" TEXT NOT NULL DEFAULT 'Productividad',
    "completed_flag" BOOLEAN NOT NULL DEFAULT false,
    "eliminated_flag" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "TASKS_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "PLAYER" ("player_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "PLAYER_email_key" ON "PLAYER"("email");

-- CreateIndex
CREATE UNIQUE INDEX "GARDENS_garden_name_key" ON "GARDENS"("garden_name");

-- CreateIndex
CREATE UNIQUE INDEX "CONSUMABLES_consumable_name_key" ON "CONSUMABLES"("consumable_name");
