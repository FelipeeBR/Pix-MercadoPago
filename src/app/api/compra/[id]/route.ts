import prisma from "@/lib/prisma";
import { NextResponse } from 'next/server';

export async function GET(req: Request, {params}: {params: {id: string}}) {

    const { id: id } = await  params;
    try {
        const compras = await prisma.vendas.findMany({
            where: {
                userId: id
            }
        });
        return NextResponse.json({compras, status: 200 });
    } catch (error) {
        return NextResponse.json({ status: 500 });
    }
}