import prisma from "@/lib/prisma";
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const client = new MercadoPagoConfig({ accessToken: process.env.ACCESS_TOKEN!, options: { timeout: 5000, idempotencyKey: "abc" }});
const payment = new Payment(client);

export async function POST(req: any, res: any) {
    const { userId, transaction_amount, description, status, compraId, paymentMethodId, payer } = await req.json();
    const body = {
        transaction_amount: Number(transaction_amount),
        description: String(description),
        payment_method_id: 'pix',
        installments: 1,
        payer: {
            email: payer.email,
            identification: {
                type: payer.identification.type,
                number: payer.identification.number
            }
        }
    };

    const requestOptions = {
        idempotencyKey: String(crypto.randomUUID()),
    };

    try {
        const result = await payment.create({ body, requestOptions });
        console.log("Resultado: ", result);
        const novoStatus = result?.status
        const novoId = result?.id
        const salvarCompra = await prisma.vendas.create({
            data: {
                userId: String(userId),
                email: payer.email,
                statusCompra: String(novoStatus),
                valorTransacao: transaction_amount,
                idVenda: String(novoId),
                descricao: description,
                dataAprovacao: null,
                dataCriacao: new Date()
            }
        });
        return NextResponse.json({ data: [result, salvarCompra] }, { status: 200 });
    } catch (error) {
        console.error("Erro: ", error);
        return NextResponse.json({ data: error }, { status: 500 });
    }
}


//Obter Pagamento
export async function GET(req: any) {
    const { searchParams } = new URL(req.url);
    const number = searchParams.get('number');
    if (!number) {
        return NextResponse.json({ error: 'Número de pagamento não fornecido.' }, { status: 400 });
    }
    try {
        const result = await payment.get({ id: number });
        return NextResponse.json({ data: result }, { status: 200 });
    } catch (error) {
        console.log("Error:", error);
        return NextResponse.json({ error: 'error.message' }, { status: 500 });
    }
}










































/*import prisma from "@/app/utils/connect";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {
        const dados = await req.json();
        //console.log(dados);
        const chave = dados["token"];
        const cnpj_cpf = dados["customer"]["identification_number"];
        const email = dados["customer"]["email"];

        if(chave !== "00ede988d3b5fd2b6cd6fcba2a300ad8"){
            return;
        }
        const existingUserByEmail = await prisma.user.findUnique({
            where: { email: email }
        });
  
        const existingUserByCpf = await prisma.user.findUnique({
            where: { cpf: cnpj_cpf }
        });

        if(existingUserByEmail?.email === email){
            console.log("Este email já está sendo usado.");
            return NextResponse.json({ user: null, message:"Este email já está sendo usado.", status: 409})
        }
        if(existingUserByCpf?.cpf === cnpj_cpf){
            console.log("Este CPF já está sendo usado.");
            return NextResponse.json({ user: null, message:"Este CPF já está sendo usado.", status: 409})
        }

        const statusVenda = dados["sale_status_detail"];
        //console.log("Esse é o Status: ",statusVenda);

        if (statusVenda === 'paid') {
            if(dados["plan"]["name"] === "LotoMax1Mes"){
                const expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate() + 30);
                const newUser = await prisma.user.create({
                    data: {
                        email: email,
                        cpf: cnpj_cpf,
                        isAdmin: false,
                        isVip: true,
                        vipExpirationDate: expirationDate
                    }
                })
                console.log('A compra foi finalizada 30 dias de acesso.');
                return NextResponse.json({ user: newUser, message:"Usuário criado com sucesso."}, {status: 201});

            }else if(dados["plan"]["name"] === "LotoMax3Meses"){
                const expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate() + 90);
                const newUser = await prisma.user.create({
                    data: {
                        email: email,
                        cpf: cnpj_cpf,
                        isAdmin: false,
                        isVip: true,
                        vipExpirationDate: expirationDate
                    }
                })
                console.log('A compra foi finalizada 90 dias de acesso.');
                return NextResponse.json({ user: newUser, message:"Usuário criado com sucesso."}, {status: 201});
            }
        } else {
            console.log('A compra não foi finalizada. Ignorando.');
        }
        return NextResponse.json({ message:"informação recebida com sucesso."}, {status: 200});
    } catch (error) {
        return NextResponse.json({ message:"Algo deu errado."}, {status: 500});
    }
}*/