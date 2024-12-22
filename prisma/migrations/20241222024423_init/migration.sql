/*
  Warnings:

  - You are about to alter the column `idVenda` on the `Vendas` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Vendas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "statusCompra" TEXT NOT NULL,
    "valorTransacao" REAL NOT NULL,
    "idVenda" INTEGER,
    "descricao" TEXT NOT NULL,
    "dataAprovacao" DATETIME,
    "dataCriacao" DATETIME NOT NULL
);
INSERT INTO "new_Vendas" ("dataAprovacao", "dataCriacao", "descricao", "email", "id", "idVenda", "statusCompra", "userId", "valorTransacao") SELECT "dataAprovacao", "dataCriacao", "descricao", "email", "id", "idVenda", "statusCompra", "userId", "valorTransacao" FROM "Vendas";
DROP TABLE "Vendas";
ALTER TABLE "new_Vendas" RENAME TO "Vendas";
CREATE UNIQUE INDEX "Vendas_idVenda_key" ON "Vendas"("idVenda");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
