import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from 'next/server';
import axios from "axios";

export async function POST(req: NextRequest) {
    try {
        const event = await req.json();

        if(event.type === "payment") {
            const paymentId = event.data.id;

            // Consultar a API do Mercado Pago para verificar o pagamento
            const response = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
                headers: {
                    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
                },
            });

            const paymentStatus = response.data.status;
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
            return NextResponse.json({ message: "Webhook processado com sucesso" }, { status: 200 });
        } else {
            return NextResponse.json({ message: "Evento não reconhecido" }, { status: 400 });
        }
    } catch (error) {
        console.error("Erro no webhook:", error);
        return NextResponse.json({ message: "Erro ao processar o webhook" }, { status: 500 });
    }
}

