/*
  Warnings:

  - You are about to drop the column `idVenda` on the `Vendas` table. All the data in the column will be lost.

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
    "descricao" TEXT NOT NULL,
    "dataAprovacao" DATETIME,
    "dataCriacao" DATETIME NOT NULL
);
INSERT INTO "new_Vendas" ("dataAprovacao", "dataCriacao", "descricao", "email", "id", "statusCompra", "userId", "valorTransacao") SELECT "dataAprovacao", "dataCriacao", "descricao", "email", "id", "statusCompra", "userId", "valorTransacao" FROM "Vendas";
DROP TABLE "Vendas";
ALTER TABLE "new_Vendas" RENAME TO "Vendas";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
