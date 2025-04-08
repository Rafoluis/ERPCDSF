"use client";

import Image from 'next/image';
import Link from 'next/link';
import { SessionProvider } from 'next-auth/react';
import Navbar from '@/components/navbar';
import Menu from '@/components/menu';
import { useEffect, useState } from 'react';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [nombreComercial, setNombreComercial] = useState("Default");

  useEffect(() => {
    async function fetchEmpresa() {
      try {
        const res = await fetch('/api/company');
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          setNombreComercial(json.data[0].nombre_comercial || "Empresa por defecto");
        }
      } catch (error) {
        console.error("Error al obtener la empresa:", error);
      }
    }
    fetchEmpresa();
  }, []);

  return (
    <SessionProvider>
      <div className="h-screen flex">
        <div className="w-[16%] md:w-[11%] lg:w-[13%] xl:w-[12%] bg-backmenu">
          <div className="bg-backgrounddefault m-0 mt-0 p-2">
            <Link href="/" className="flex items-center justify-center gap-0">
              <Image src="/logodental.png" alt="logo" width={60} height={60} />
              <span className="hidden lg:block font-bold">{nombreComercial}</span>
            </Link>
          </div>
          <div className="flex-1 justify-between p-4">
            <Menu />
          </div>
        </div>
        <div className="w-[90%] md:w-[93%] lg:w-[90%] xl:w-[91%] bg-backpage overflow-scroll">
          <Navbar />
          {children}
        </div>
      </div>
    </SessionProvider>
  );
}
