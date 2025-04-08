-- CreateTable
CREATE TABLE "Empresa" (
    "id_empresa" SERIAL NOT NULL,
    "ruc" TEXT NOT NULL,
    "razon_social" TEXT NOT NULL,
    "nombre_comercial" TEXT,
    "domicilio_fiscal" TEXT,
    "ubigeo" TEXT,
    "actividad_economica" TEXT,
    "tipo_contribuyente" TEXT,
    "clave_sol" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id_empresa")
);

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_ruc_key" ON "Empresa"("ruc");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_email_key" ON "Empresa"("email");
