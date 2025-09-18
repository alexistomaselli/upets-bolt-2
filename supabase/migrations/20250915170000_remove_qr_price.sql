/*
  # Eliminar campo de precio de QRs

  Esta migración elimina el campo purchase_price de la tabla qr_codes ya que los QRs
  no son productos para venta y su precio depende de planes de membresía.
*/

-- Eliminar la columna purchase_price de la tabla qr_codes
ALTER TABLE qr_codes DROP COLUMN IF EXISTS purchase_price;