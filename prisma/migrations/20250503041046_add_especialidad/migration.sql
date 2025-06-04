/*
  Warnings:

  - You are about to drop the column `especialidad` on the `Empleado` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cita" ADD COLUMN     "id_especialidad" INTEGER;

-- AlterTable
ALTER TABLE "Empleado" DROP COLUMN "especialidad",
ADD COLUMN     "id_especialidad" INTEGER;

-- CreateTable
CREATE TABLE "Especialidad" (
    "id_especialidad" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Especialidad_pkey" PRIMARY KEY ("id_especialidad")
);

-- CreateIndex
CREATE UNIQUE INDEX "Especialidad_nombre_key" ON "Especialidad"("nombre");

-- CreateIndex
CREATE INDEX "Empleado_id_especialidad_idx" ON "Empleado"("id_especialidad");

-- AddForeignKey
ALTER TABLE "Empleado" ADD CONSTRAINT "Empleado_id_especialidad_fkey" FOREIGN KEY ("id_especialidad") REFERENCES "Especialidad"("id_especialidad") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_id_especialidad_fkey" FOREIGN KEY ("id_especialidad") REFERENCES "Especialidad"("id_especialidad") ON DELETE SET NULL ON UPDATE CASCADE;
