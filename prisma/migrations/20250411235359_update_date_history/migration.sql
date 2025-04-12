-- AlterTable
ALTER TABLE "Historia_Clinica" ADD COLUMN     "estado_tratamiento" TEXT,
ADD COLUMN     "fecha_alta" TIMESTAMP(3),
ADD COLUMN     "fecha_ultima_consulta" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "DoctorAsignado" (
    "id_historia" INTEGER NOT NULL,
    "id_empleado" INTEGER NOT NULL,
    "fecha_asignacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_retiro" TIMESTAMP(3),

    CONSTRAINT "DoctorAsignado_pkey" PRIMARY KEY ("id_historia","id_empleado","fecha_asignacion")
);

-- AddForeignKey
ALTER TABLE "DoctorAsignado" ADD CONSTRAINT "DoctorAsignado_id_historia_fkey" FOREIGN KEY ("id_historia") REFERENCES "Historia_Clinica"("id_historia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorAsignado" ADD CONSTRAINT "DoctorAsignado_id_empleado_fkey" FOREIGN KEY ("id_empleado") REFERENCES "Empleado"("id_empleado") ON DELETE RESTRICT ON UPDATE CASCADE;
