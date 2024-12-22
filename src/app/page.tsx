"use client"
import ButtonLogin from "@/components/Buttons/ButtonLogin";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaUserLock } from "react-icons/fa";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const checkAuth = async () => {
      const session = await getSession();
      if (session) {
        router.replace('/home'); 
      }
    };

    checkAuth();
  }, []);
  return (
    <div className="flex justify-center">
      <div className="flex flex-col w-96 h-screen justify-center">
        <Card className="text-center">
          <CardHeader>
            <CardTitle>Para acessar sua conta</CardTitle>
            <CardDescription>Faça o login</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <FaUserLock size={50}/>
          </CardContent>
          <CardFooter className="items-center justify-center">
            <ButtonLogin/>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
