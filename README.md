<img src="https://github.com/user-attachments/assets/333e8789-6f37-4d62-a731-64ce60ec3ed7" width="50" title="Pix" alt="Pix"/>
<img src="https://github.com/user-attachments/assets/d8d4bc61-a7a5-433f-aab2-5b7d4c7bece0" width="150" title="Mercado" alt="Mercado"/>

# Pix Mercado Pago - Qrcode - Nextjs 15
Esse é um projeto para demonstrar o uso do pix do mercado pago com o Nextjs.

## Tecnologias Utilizadas
- <a href="https://www.prisma.io/">Prisma ORM</a>
- <a href="https://ui.shadcn.com/">Shadcn UI</a>
- <a href="https://next-auth.js.org/">Next Auth</a>
- <a href="https://react-icons.github.io/react-icons/">React Icons</a>
- Sqlite
## .env
```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
DATABASE_URL="file:./dev.db"
SITE="http://localhost:3000/"
ACCESS_TOKEN= Aqui token do mercado pago
```
## Demo

![screen-capture](https://github.com/user-attachments/assets/e2463f96-93f7-442f-9bde-24609a013699)

## Configuração WebHook

Para testar o Webhook utilize o <a href="https://tunnelmole.com/">Tunnelmole</a>
```npm install -g tunnelmole```

a rota do Webhook é ```/api/webhook```

Quando o pagamento é aprovado, a compra é alterada para ```approved``` no banco de dados

```
if(paymentStatus === "approved") {
    console.log("Pagamento aprovado:", response.data);
    await prisma.vendas.update({
        where: { idVenda: String(paymentId) },
        data: {
            statusCompra: "approved",
            dataAprovacao: new Date(),
        },
    });
} else {
    console.log("Pagamento não aprovado:", response.data);
}
```


![Captura de tela 2024-12-22 192741](https://github.com/user-attachments/assets/7af93335-da8c-4758-9180-ab5add904af7)


