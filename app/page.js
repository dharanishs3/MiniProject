"use client"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router=useRouter();
    const getStarted=()=>{
            router.push('/dashboard');
    }
  return (
    <div className="flex justify-center items-center pt-100 ">
      <div className="grid grid-cols-1 gap-5 justify-center ">
        <div className="flex gap-5">
      <Image src={'/logo.svg'} width={75} height={75} alt='logo' />
        <h1 className="font-bold text-primary text-8xl">Harmoniq</h1>
        </div>
        <div className="flex justify-center">
        <Button onClick={getStarted}>Get Started</Button>
        </div>
      </div>
    </div>
  );
}
