'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FcOk } from 'react-icons/fc';
import { TbCircleNumber1 } from 'react-icons/tb';
import { TbCircleNumber2 } from 'react-icons/tb';
import { TbCircleNumber3 } from 'react-icons/tb';
import { LuCopy } from "react-icons/lu";
import { FaShoppingCart } from "react-icons/fa";
import { FaPix } from 'react-icons/fa6';
import MpLogo from '../../../public/mp-logo.png';
import Spinner from '../../../public/spinner.gif';
import { criarPix, verPagamento } from '@/app/api/pagamento/service';
import { FaCheck } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { produtos } from '@/lib/products';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


const Pagamento = () => {
    const { data: session } = useSession();
    const email = (session as any)?.user.email;
    const userId = (session as any)?.user.id;
    
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const produto = produtos.find((p) => p.id === Number(id));
    
    const [verPix, setVerPix] = useState(false);
    const [isAprovado, setIsAprovado] = useState(false);
    const [mensagem, setMensagem] = useState(false);
    const [ocultarCard, setOcultarCard] = useState(false);
    const [liberaBotao, setLiberaBotao] = useState(false);

    const [cpf, setCpf] = useState("");
    const [qrcod, setQrcode] = useState("");
    const [hashQrcode, setHashQrcode] = useState("");
    const [status, setStatus] = useState("");
    const [compraId, setCompraId] = useState("");

    const BODY_VENDA = {
        userId: userId,
        transaction_amount: produto?.preco,
        description: produto?.nome,
        status: status,
        compraId: compraId, 
        paymentMethodId: "pix",
        payer: {
            email: email,
            first_name: null,
            last_name: null,                         
            identification: {
                type: "cpf",            
                number: cpf 
            },
        }
    }
    const handlePost = () => {
        criarPix(BODY_VENDA)
            .then(async (response) => {
                const [result, salvarCompra] = response?.data?.data || [];
                const imgQrcode = result?.point_of_interaction?.transaction_data?.qr_code_base64;
                const qrcodeHash = result?.point_of_interaction?.transaction_data?.qr_code;
                //const ticketUrl = result?.point_of_interaction?.transaction_data?.ticket_url;
                const statusCompra = response?.data?.data?.status;
                const idCompra = result?.id;
    
                if (imgQrcode) {
                    setQrcode(imgQrcode);
                    setHashQrcode(qrcodeHash);
                    setStatus(statusCompra);
                    setCompraId(idCompra);
                } else {
                    console.error("[ERRO] Não foi encontrado uma resposta válida: ", response);
                }
            })
            .catch((error) => {
                console.error("Erro ao chamar criarPix:", error);
            });
    
        setOcultarCard(true);
    };

    const copiarPix = async () => {
        try {
            await navigator.clipboard.writeText(hashQrcode);
            setMensagem(true);
        }catch(err) {
            console.log('Falha ao copiar o pix', err);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setCpf(value);
        if (value.length === 11) {
            setLiberaBotao(true);
        } else {
            setLiberaBotao(false);
        }
    };

    useEffect(() => {
        if(ocultarCard) {
            setVerPix(true);
        }

        const intervalId = setInterval(async () => {
            try {
                verPagamento(compraId);
                const pagamento:any = await verPagamento(compraId);
                if(pagamento === 'approved'){
                    setIsAprovado(true);
                }
            } catch (error) {
              console.error("Erro ao verificar pagamento:", error);
              clearInterval(intervalId);
            }
          }, 5000); 
        
    }, [compraId]);
    
    return (
        <div className='m-5'>
                    <div className="flex grid-cols-1 lg:grid-cols-2 gap-6 justify-center mb-6 mx-4 items-center">
                {/* Forma de Pagamento */}
                {verPix && 
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-medium flex items-center mb-4">
                            Forma de Pagamento: 
                            <span className="font-bold ml-2 md:text-lg">Pix</span>
                            <span className='font-bold ml-4 text-green-500 md:text-lg'>R$ {produto?.preco}</span>
                        </h2>
                        <div className="flex flex-col items-center">
                            {/* QR Code e Descrição */}
                            <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6 text-left">
                                <div className="flex items-center justify-center">
                                    <Image 
                                        src={`data:image/jpeg;base64,${qrcod}`} 
                                        width={200} 
                                        height={200} 
                                        alt="QR Code do Pix" 
                                        className="rounded-md border border-gray-300"
                                    />
                                </div>
                                <div className='mt-4 lg:mt-0 text-center'>
                                    <h3 className="text-md text-gray-700 mb-3">
                                        Pague com o Pix a qualquer momento, em qualquer dia da semana. O pagamento é instantâneo, prático e seguro!
                                    </h3>
                                    <div>
                                        {!isAprovado && (
                                            <p className="flex flex-col items-center space-x-2">
                                                <Image src={Spinner} alt={''} width={30} height={30}></Image>
                                                <span className='font-bold'>Aguardando confirmação de pagamento</span>
                                            </p>
                                        )}
                                        {isAprovado && (
                                            <>
                                                <p className="flex flex-col items-center space-x-2">
                                                    <FcOk size={50}/>
                                                    <span className='font-bold text-green-500'>Pagamento Aprovado</span>
                                                </p>
                                                <a href="/dashboard">
                                                    <button className='bg-green-500 rounded text-white p-3'>Acesse Agora</button>  
                                                </a>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Instruções */}
                            <div className="mt-6 space-y-4 text-sm text-gray-800 mb-4">
                                <p className="flex items-start space-x-2">
                                    <TbCircleNumber1 size={24} className="text-blue-500" />
                                    <span>Abra o app do seu banco ou instituição financeira e acesse o ambiente Pix.</span>
                                </p>
                                <p className="flex items-start space-x-2">
                                    <TbCircleNumber2 size={24} className="text-blue-500" />
                                    <span>Escolha a opção pagar com QR Code e escaneie a imagem acima.</span>
                                </p>
                                <p className="flex items-start space-x-2">
                                    <TbCircleNumber3 size={24} className="text-blue-500" />
                                    <span>Confirme as informações e finalize a compra.</span>
                                </p>
                                <p className="flex items-start space-x-2">
                                    <span className='text-md font-bold'>Você também pode pagar através do Pix Copia e Cola acessando seu internet banking e usando o código abaixo:</span>
                                </p>
                            </div>
                            <div>
                            </div>
                            <div className='w-[250px]'>
                                <h3 className='font-bold text-black truncate mb-3'>{hashQrcode}</h3>
                            </div>
                            <div className='w-full flex flex-col truncate'>
                                <Button className='bg-slate-100 border border-blue-500 p-3 rounded text-base text-blue-500' onClick={copiarPix}>
                                    <LuCopy />Copiar
                                </Button>
                            </div>
                            {mensagem && (
                                <Alert className='text-green-600 font-bold bg-green-200'>Pix Copiado</Alert>
                            )}
                        </div>
                    </div>
                }

                {/* Detalhes da Compra */}
                {!ocultarCard && 
                    <>
                        <div className='flex flex-col lg:flex-row gap-6 justify-center mb-6 mx-4 items-start'>
                            <Card className="bg-white border border-gray-200 shadow-sm flex flex-col w-full">
                                <CardHeader>
                                    <CardTitle>Pagamento</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center">
                                        <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                                    </div>
                                    <div className='mb-3'>
                                        <Label htmlFor="dados">Dados Pessoais</Label>
                                    </div>
                                    <div className='flex flex-col'>
                                        <div className='mb-2'>
                                            <Input type="email" placeholder="Email" defaultValue={email} required/>
                                        </div>
                                        <div className='xl:flex w-full'>
                                            <div className='mb-2'>
                                                <Input type="text" placeholder="Nome" required/>
                                            </div>
                                            <div className='mb-2'>
                                                <Input className='[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                                                type="number" id='cpf' placeholder="CPF" onChange={handleChange} required/>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex items-center justify-center">
                                    <div className='mt-3 mb-3'>
                                        <Label htmlFor="pagamento">Forma de Pagamento</Label>
                                        <div className='flex items-center justify-center'>
                                            <Image src={MpLogo} width={100} height={100} alt='mplogo'/>
                                        </div>
                                        <div className="flex items-center justify-center mt-5">
                                            <Alert >
                                                <div className='flex items-center justify-center space-x-2'>
                                                    <FaPix size={24} className="text-[#00B7A9]"/>
                                                    <AlertTitle className='text-xl uppercase'>Pix</AlertTitle>
                                                </div>
                                            </Alert>
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>
                            <Card className='bg-white border border-gray-200 shadow-sm flex flex-col w-full'>
                                <CardHeader>
                                    <CardTitle className='mb-3'>Você está comprando:</CardTitle>
                                    <CardDescription className="flex items-start space-x-2 font-bold">
                                        <FaShoppingCart size={24} className='text-blue-600'/>
                                        <Label>{produto?.nome}</Label>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center">
                                        <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                                    </div>
                                    <div className='flex flex-col items-center'>
                                        <Image src={produto?.image!} alt={''} width={300} height={300}></Image>
                                        <Label>{produto?.descricao}</Label>
                                    </div>
                                    <div className="flex items-center mt-3 mb-3">
                                        <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                                    </div>
                                    <div className='flex items-center space-x-4'>
                                        <Input type="text" placeholder="Cupom de desconto" />
                                        <Button className='bg-blue-600 rounded text-white'>Aplicar</Button>
                                    </div>
                                    <div className="flex items-center my-3">
                                        <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                                    </div>
                                    <div className='flex place-content-between'>
                                        <p>Total</p>
                                        <p className='font-bold text-green-500'>R$ {produto?.preco}</p>
                                    </div>
                                    <div className="flex items-center my-3">
                                        <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <div className="w-full flex flex-col">
                                        {liberaBotao && (
                                            <Button onClick={handlePost} className="bg-green-600 rounded uppercase text-white"><FaCheck />Finalizar Compra</Button>
                                        )}
                                        {!liberaBotao && (
                                            <Button className="bg-green-600 rounded uppercase text-white" disabled><FaCheck />Finalizar Compra</Button>
                                        )}
                                    </div>
                                </CardFooter>
                            </Card>
                        </div>
                    </>
                }
            </div>
        </div>
    )
}

export default Pagamento;