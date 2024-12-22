'use client';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

const Compras = () => {
    const {data: session} = useSession();
    const id = (session as any)?.user.id;
    const [vendas, setVendas] = useState([]);
    useEffect(()=> {
        console.log("id: ",id)
        const fetchData = async () => {
          try {
            const response = await axios.get(`/api/compra/${id}`);
            if (response.data && response.data.compras) {
                const formatData = response.data.compras.map((compra: any) =>({
                    ...compra,
                    dataFormatada: format(new Date(compra.dataCriacao), 'dd/MM/yyyy - HH:mm'),

                }));
                setVendas(formatData || []);
            }
            console.log(response.data)
          } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
              console.error("Erro:", error);
            }
          }
        };
        fetchData();
    }, [id]);
    return (
      <div className='flex items-center justify-center m-5'>
        <div className='flex items-center justify-center m-5 w-96'>
          <Table>
            <TableCaption>Sua lista de compras.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendas.map((venda: any, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{venda.dataFormatada}</TableCell>
                  <TableCell>{venda.descricao}</TableCell>
                  <TableCell>{venda.valorTransacao}</TableCell>
                  {venda.statusCompra === 'pending' &&
                    <TableCell>
                        <span className='bg-orange-500 px-2 rounded text-white'>Pendente</span>
                    </TableCell>
                  }
                  {venda.statusCompra === 'approved' &&
                    <TableCell>
                        <span className='bg-green-500 px-2 rounded text-white'>Aprovado</span>
                    </TableCell>
                  }
                  {venda.statusCompra === 'canceled' &&
                    <TableCell>
                        <span className='bg-red-500 px-2 rounded text-white'>Cancelado</span>
                    </TableCell>
                  }
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
}

export default Compras;