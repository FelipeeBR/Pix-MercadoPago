-- CreateTable
CREATE TABLE "Vendas" (
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

-- CreateIndex
CREATE UNIQUE INDEX "Vendas_idVenda_key" ON "Vendas"("idVenda");
