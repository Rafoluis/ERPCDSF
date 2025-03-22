import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getActiveDoctors() {
  return await prisma.empleado.findMany({
    where: {
      deletedAt: null,
    },
    include: {
      usuario: true,
    },
  });
}

export async function updateDoctor(id_empleado: number, data: Partial<{ especialidad: string }>) {
  return await prisma.empleado.update({
    where: { id_empleado },
    data,
  });
}

export async function deleteDoctor(id_empleado: number) {
  return await prisma.empleado.update({
    where: { id_empleado },
    data: { deletedAt: new Date() },
  });
}
