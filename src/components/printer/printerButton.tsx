"use client";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Printer } from "lucide-react";
import { useEffect, useState } from "react";
import { defaultTableStyles } from "./pdfStyles";

type PrintButtonProps = {
  ticketId: number | string;
  ticketData?: any;
};

const PrintButton = ({ ticketId, ticketData }: PrintButtonProps) => {
  const [ticket, setTicket] = useState<any>(ticketData || null);

  useEffect(() => {
    if (!ticketData && ticketId) {
      const fetchTicket = async () => {
        try {
          const res = await fetch(`/api/ticket?id=${ticketId}`);
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Error al obtener los datos del ticket");
          setTicket(data);
        } catch (error) {
          console.error("Error al obtener los datos del ticket:", error);
        }
      };
      fetchTicket();
    }
  }, [ticketId, ticketData]);

  const loadImageAsBase64 = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        } else reject(new Error("No se pudo obtener el contexto del canvas"));
      };
      img.onerror = () => reject(new Error("Error al cargar la imagen"));
      img.src = url;
    });
  };

  const generatePDF = async () => {
    try {
      const ticketToPrint = ticket || (await (async () => {
        const res = await fetch(`/api/ticket?id=${ticketId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Error al obtener los datos del ticket");
        return data;
      })());

      const citaIds = (ticketToPrint.ticketCitas || []).map((tc: { cita: { id: any; }; }) => tc.cita.id);

      const pagosPreviosArrays = await Promise.all(
        citaIds.map((id: any) =>
          fetch(`/api/tickets?citaId=${id}`)
            .then(r => r.json())
            .then((list: any[]) =>
              list.filter(t => t.id_ticket !== ticketToPrint.id_ticket)
            )
        )
      );
      const esPrimerPago = pagosPreviosArrays.every(arr => arr.length === 0);

      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = { left: 14, right: 14, bottom: 14 };

      const logoData = await loadImageAsBase64("/logodental.png");
      doc.addImage(logoData, "PNG", margin.left, 15, 35, 25);

      // Información de la empresa
      doc.setFont("helvetica", "bold").setFontSize(12).text("Nombre de la empresa", 55, 20);
      doc.setFont("helvetica", "normal").setFontSize(10)
        .text("RUC: 123456789", 55, 26)
        .text("Dirección", 55, 32)
        .text("Teléfono", 55, 38);

      // Título del comprobante
      doc.setFont("helvetica", "bold").setFontSize(14)
        .text("COMPROBANTE DE PAGO", pageWidth / 2, 50, { align: 'center' });
      doc.setFont("helvetica", "normal").setFontSize(10)
        .text(`CÓDIGO DE COMPROBANTE: ${ticketToPrint.id_ticket}`, pageWidth / 2, 56, { align: 'center' });

      // Datos del paciente
      const paciente = ticketToPrint.paciente?.usuario
        ? {
            nombre: `${ticketToPrint.paciente.usuario.nombre} ${ticketToPrint.paciente.usuario.apellido}`,
            direccion: ticketToPrint.paciente.usuario.direccion || 'No registrada',
            dni: ticketToPrint.paciente.usuario.dni
          }
        : { nombre: 'No encontrado', direccion: '', dni: '' };
      doc.autoTable({
        ...defaultTableStyles,
        startY: 65,
        margin: { left: margin.left },
        head: [[ 'Nombres y Apellidos', paciente.nombre ]],
        body: [[ 'Dirección', paciente.direccion ], [ 'DNI', paciente.dni ]]
      });

      // Detalles del pago
      const fechaEmision = ticketToPrint.fecha_emision
        ? new Date(ticketToPrint.fecha_emision).toLocaleDateString('es-PE', { timeZone: 'UTC' })
        : '';
      const estadoPago = ticketToPrint.deuda_restante > 0 ? 'PAGO PARCIAL' : 'PAGO TOTAL';
      const medioPago = ticketToPrint.medio_pago || 'EFECTIVO';
      doc.autoTable({
        ...defaultTableStyles,
        startY: doc.lastAutoTable.finalY + 5,
        margin: { left: margin.left },
        head: [[ 'FECHA EMISIÓN', 'ESTADO PAGO', 'MÉTODO PAGO', 'MONEDA' ]],
        body: [[ fechaEmision, estadoPago, medioPago, 'SOLES' ]]
      });

      // Servicios y citas
      let itemsWithDate: Array<{ fechaCita: Date; serviceName: string; description: string; cantidad: number; tarifa: number }> = [];
      if (ticketToPrint.ticketCitas?.length > 0) {
        ticketToPrint.ticketCitas.forEach((ticketCita: any) => {
          const fechaCita = new Date(ticketCita.cita.fecha_cita);
          const fechaFormatted = fechaCita.toLocaleDateString('es-PE', { timeZone: 'UTC' });
          if (ticketCita.cita.servicios?.length > 0) {
            ticketCita.cita.servicios.forEach((servicioCita: any) => {
              const base = servicioCita.servicio.descripcion ? servicioCita.servicio.descripcion + ' - ' : '';
              itemsWithDate.push({
                fechaCita,
                serviceName: servicioCita.servicio.nombre_servicio,
                description: `${base}De la cita - ${fechaFormatted}`,
                cantidad: servicioCita.cantidad,
                tarifa: servicioCita.servicio.tarifa
              });
            });
          } else {
            itemsWithDate.push({ fechaCita, serviceName: 'CONSULTA', description: `De la cita - ${fechaFormatted}`, cantidad: 1, tarifa: ticketToPrint.monto_total || 0 });
          }
        });
      } else {
        const fallback = new Date(ticketToPrint.fecha_emision);
        const fform = fallback.toLocaleDateString('es-PE', { timeZone: 'UTC' });
        itemsWithDate.push({ fechaCita: fallback, serviceName: 'CONSULTA', description: `De la cita - ${fform}`, cantidad: 1, tarifa: ticketToPrint.monto_total || 0 });
      }
      itemsWithDate.sort((a,b) => a.fechaCita.getTime() - b.fechaCita.getTime());
      const items = itemsWithDate.map((it,i) => [i+1, it.serviceName, it.description, it.cantidad, it.tarifa]);
      doc.autoTable({
        ...defaultTableStyles,
        startY: doc.lastAutoTable.finalY + 5,
        margin: { left: margin.left },
        head: [[ 'ITEM', 'SERVICIO', 'DESCRIPCIÓN', 'CANT.', 'P. UNID.' ]],
        body: items
      });

      const midY = pageHeight / 2;

      // Observaciones
      const pagado = ticketToPrint.monto_pagado || 0;
      const deuda = ticketToPrint.deuda_restante || 0;
      
      if (deuda > 0 || !esPrimerPago) {
        let observacionesBody: string[] = [];
      
        if (deuda > 0) {
          observacionesBody.push(
            `Pago realizado S/ ${pagado.toFixed(2)}, pendiente S/ ${deuda.toFixed(2)}`
          );
        } else {
          observacionesBody.push("Pago de la deuda anterior cancelado");
        }
      
        doc.autoTable({
          ...defaultTableStyles,
          startY: midY,
          margin: { left: margin.left },
          head: [["OBSERVACIONES"]],
          body: observacionesBody.map(text => [text]),
          tableWidth: 80
        });
      }
      
      // Resumen importes
      const total = ticketToPrint.monto_total || 0;
      const summaryData = [
        [ 'OP. GRAVADAS', `S/ ${total}` ],
        [ 'OP. INAFECTAS', 'S/ 0' ],
        [ 'OP. EXONERADAS', 'S/ 0' ],
        [ 'OP. GRATUITAS', 'S/ 0' ],
        [ 'DESCUENTOS', 'S/ 0' ],
        [ 'IGV 18%', `S/ ${(total * 0.18).toFixed(2)}` ],
        [ 'IMPORTE TOTAL', `S/ ${total}` ]
      ];
      if (deuda > 0) summaryData.push([ 'MONTO PAGADO', `S/ ${pagado}` ], [ 'DEUDA RESTANTE', `S/ ${deuda}` ]);
      doc.autoTable({
        ...defaultTableStyles,
        startY: midY,
        margin: { left: pageWidth - margin.right - 80 },
        head: [[ '', '' ]],
        body: summaryData,
        tableWidth: 80
      });

      doc.save(`Boleta_${ticketId}.pdf`);
    } catch (err) {
      console.error('Error al generar PDF', err);
    }
  };

  return (
    <button onClick={generatePDF} disabled={!ticket} className="w-7 h-7 flex items-center justify-center rounded-full bg-indigo-200 hover:bg-indigo-300">
      <Printer size={18} />
    </button>
  );
};

export default PrintButton;
