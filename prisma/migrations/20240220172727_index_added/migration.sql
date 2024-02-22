-- CreateEnum
CREATE TYPE "TrackingStatus" AS ENUM ('FACTURADO', 'DESPACHADO', 'EN_PALLET', 'EN_CONTENEDOR', 'EN_PUERTO', 'EN_ADUANA', 'CANAL_ROJO', 'PEDIENTE_TRANSITO', 'EN_TRANSITO', 'ENTREGADO');

-- CreateIndex
CREATE INDEX "Tracking_hbl_idx" ON "Tracking"("hbl");

-- CreateIndex
CREATE INDEX "Tracking_oldInvoiceId_idx" ON "Tracking"("oldInvoiceId");
