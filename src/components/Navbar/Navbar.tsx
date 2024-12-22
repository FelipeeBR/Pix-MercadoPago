"use client";
import Link from "next/link";
import React from "react";
import ButtonLogout from "../Buttons/ButtonLogout";
import { SiHomebridge } from "react-icons/si";
import { FaUserCircle } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { useSession } from "next-auth/react";

const Navbar = () => {
    const {data:session} = useSession();
    return (
        <div>
            {session ? (
                <div className="flex justify-between items-center w-9/12 h-20 px-4 text-black bg-grey-700 rounded nav border border-slate-200 shadow-md">
                    <div>
                        <h1 className="text-2xl font-signature ml-2">
                            <Link href={"/home"}>
                                <SiHomebridge size={50}/>
                            </Link>
                        </h1>
                    </div>
                    <div>
                        {session ? (
                            <h3 className="md:text-2xl font-bold flex">
                                <FaUserCircle size={30}/>
                                {(session as any).user?.name}
                            </h3>
                        ): (
                            <h3 className="md:text-2xl font-bold">
                                Entrar
                            </h3>
                        )}
                    </div>
                    <div>
                        <Link href={"/compras"}>
                        <h3 className="md:text-2xl font-bold flex">
                            <FaCartShopping size={30}/>
                            Minhas Compras
                        </h3>
                        </Link>
                    </div>
                    <div>
                        <ButtonLogout/>
                    </div>
                </div>
            ): (
                <div>
                    <h1 className="text-3xl font-bold">Entrar</h1>
                </div>
            )}
        </div>
    )
}

export default Navbar;