/*
  Warnings:

  - A unique constraint covering the columns `[idVenda]` on the table `Vendas` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Vendas_idVenda_key" ON "Vendas"("idVenda");
