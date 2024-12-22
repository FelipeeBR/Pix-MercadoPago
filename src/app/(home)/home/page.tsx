"use client";
import Navbar from '@/components/Navbar/Navbar';
import React, { useEffect } from 'react';
import { produtos } from '@/lib/products';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

const Home = () => {
    const router = useRouter();

    const handleComprar = (produto: any) => {
        const query = new URLSearchParams(produto).toString();
        router.push(`/pagamento?${query}`);
    };
    return (
        <div className=''>
            <div className='flex items-center justify-center m-5'>
                <div className="grid md:grid-cols-2 gap-4 ">
                    {produtos.map((produto, index) => (
                        <Card key={index} className="w-[350px]">
                        <CardHeader>
                            <CardTitle>{produto.nome}</CardTitle>
                            <CardDescription>{produto.descricao}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Image src={produto.image} alt={produto.nome} />
                            <Label>R$ {produto.preco}</Label>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button onClick={() => handleComprar({ id: produto.id, nome: produto.nome })}>Comprar Agora</Button>
                        </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Home;