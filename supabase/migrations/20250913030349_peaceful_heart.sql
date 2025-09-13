/*
  # Sistema de Gestión de Customers (Clientes)

  1. Nuevas Tablas
    - `pets` - Información de las mascotas
    - `qr_codes` - Códigos QR asignados a mascotas
    - `emergency_contacts` - Contactos de emergencia por mascota
    - `veterinary_info` - Información veterinaria de mascotas

  2. Actualizaciones
    - Actualizar `user_profiles` para incluir campos específicos de customer
    - Agregar políticas RLS para customers

  3. Seguridad
    - RLS habilitado en todas las tablas
    - Políticas para que customers solo vean sus propios datos
    - Super admins pueden ver todo
*/

-- Actualizar user_profiles para customers
ALTER TABLE user_profiles 
ADD COLUMN whatsapp text,
ADD COLUMN emergency_contact_name text,
ADD COLUMN emergency_contact_phone text,
ADD COLUMN address text,
ADD COLUMN city text,
ADD COLUMN postal_code text,
ADD COLUMN country text DEFAULT 'AR',
ADD COLUMN subscription_status text DEFAULT 'free', -- free, premium, expired
ADD COLUMN subscription_expires_at timestamptz;

-- Tabla de mascotas
CREATE TABLE IF NOT EXISTS pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  species text NOT NULL DEFAULT 'dog', -- dog, cat, other
  breed text,
  color text,
  size text, -- small, medium, large
  weight decimal,
  birth_date date,
  gender text, -- male, female, unknown
  microchip_number text,
  special_needs text,
  medical_conditions text,
  medications text,
  photo_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de códigos QR
CREATE TABLE IF NOT EXISTS qr_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  pet_id uuid REFERENCES pets(id) ON DELETE CASCADE,
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  qr_type text DEFAULT 'basic', -- basic, premium, custom
  status text DEFAULT 'inactive', -- inactive, active, lost, found, expired
  activation_date timestamptz,
  expiry_date timestamptz,
  scan_count integer DEFAULT 0,
  last_scan_date timestamptz,
  last_scan_location text,
  purchase_date timestamptz DEFAULT now(),
  purchase_price decimal,
  sold_by_branch_id uuid, -- Referencia a branches cuando se implemente
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de contactos de emergencia
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid REFERENCES pets(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text NOT NULL,
  whatsapp text,
  relationship text, -- owner, family, friend, veterinarian
  is_primary boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Tabla de información veterinaria
CREATE TABLE IF NOT EXISTS veterinary_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid REFERENCES pets(id) ON DELETE CASCADE,
  vet_name text,
  vet_clinic text,
  vet_phone text,
  vet_address text,
  last_checkup date,
  next_checkup date,
  vaccinations jsonb DEFAULT '[]', -- Array de vacunas con fechas
  allergies text,
  insurance_info text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de escaneos de QR (para tracking)
CREATE TABLE IF NOT EXISTS qr_scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_code_id uuid REFERENCES qr_codes(id) ON DELETE CASCADE,
  scanner_ip inet,
  scanner_user_agent text,
  scan_location text, -- Geolocation si está disponible
  scan_date timestamptz DEFAULT now(),
  contact_made boolean DEFAULT false,
  notes text
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_pets_owner_id ON pets(owner_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_pet_id ON qr_codes(pet_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_owner_id ON qr_codes(owner_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_code ON qr_codes(code);
CREATE INDEX IF NOT EXISTS idx_qr_codes_status ON qr_codes(status);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_pet_id ON emergency_contacts(pet_id);
CREATE INDEX IF NOT EXISTS idx_veterinary_info_pet_id ON veterinary_info(pet_id);
CREATE INDEX IF NOT EXISTS idx_qr_scans_qr_code_id ON qr_scans(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_qr_scans_scan_date ON qr_scans(scan_date);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON pets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_qr_codes_updated_at BEFORE UPDATE ON qr_codes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_veterinary_info_updated_at BEFORE UPDATE ON veterinary_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies

-- Pets: Los usuarios solo pueden ver sus propias mascotas
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own pets"
  ON pets FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Users can insert own pets"
  ON pets FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update own pets"
  ON pets FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can delete own pets"
  ON pets FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Super admins can manage all pets"
  ON pets FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM get_user_roles(auth.uid()) 
      WHERE role_name = 'super_admin'
    )
  );

-- QR Codes: Los usuarios solo pueden ver sus propios QRs
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own qr codes"
  ON qr_codes FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Users can update own qr codes"
  ON qr_codes FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Super admins can manage all qr codes"
  ON qr_codes FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM get_user_roles(auth.uid()) 
      WHERE role_name = 'super_admin'
    )
  );

-- Branch admins pueden insertar QR codes (para ventas)
CREATE POLICY "Branch admins can insert qr codes"
  ON qr_codes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM get_user_roles(auth.uid()) 
      WHERE role_name IN ('super_admin', 'company_admin', 'branch_admin')
    )
  );

-- Emergency Contacts: Solo el dueño de la mascota
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pet owners can manage emergency contacts"
  ON emergency_contacts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pets 
      WHERE pets.id = emergency_contacts.pet_id 
      AND pets.owner_id = auth.uid()
    )
  );

CREATE POLICY "Super admins can manage all emergency contacts"
  ON emergency_contacts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM get_user_roles(auth.uid()) 
      WHERE role_name = 'super_admin'
    )
  );

-- Veterinary Info: Solo el dueño de la mascota
ALTER TABLE veterinary_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pet owners can manage veterinary info"
  ON veterinary_info FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pets 
      WHERE pets.id = veterinary_info.pet_id 
      AND pets.owner_id = auth.uid()
    )
  );

CREATE POLICY "Super admins can manage all veterinary info"
  ON veterinary_info FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM get_user_roles(auth.uid()) 
      WHERE role_name = 'super_admin'
    )
  );

-- QR Scans: Lectura pública para funcionalidad de encontrar mascotas
ALTER TABLE qr_scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert qr scans"
  ON qr_scans FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "QR owners can view scans of their codes"
  ON qr_scans FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM qr_codes 
      WHERE qr_codes.id = qr_scans.qr_code_id 
      AND qr_codes.owner_id = auth.uid()
    )
  );

CREATE POLICY "Super admins can view all qr scans"
  ON qr_scans FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM get_user_roles(auth.uid()) 
      WHERE role_name = 'super_admin'
    )
  );

-- Funciones auxiliares para customers

-- Función para generar código QR único
CREATE OR REPLACE FUNCTION generate_qr_code()
RETURNS text AS $$
DECLARE
  new_code text;
  code_exists boolean;
BEGIN
  LOOP
    -- Generar código alfanumérico de 8 caracteres
    new_code := 'QR' || upper(substring(md5(random()::text) from 1 for 6));
    
    -- Verificar si ya existe
    SELECT EXISTS(SELECT 1 FROM qr_codes WHERE code = new_code) INTO code_exists;
    
    -- Si no existe, salir del loop
    IF NOT code_exists THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Función para activar QR
CREATE OR REPLACE FUNCTION activate_qr_code(qr_code_text text, pet_id_param uuid)
RETURNS boolean AS $$
DECLARE
  qr_record qr_codes%ROWTYPE;
BEGIN
  -- Buscar el QR code
  SELECT * INTO qr_record FROM qr_codes WHERE code = qr_code_text;
  
  -- Verificar que existe y pertenece al usuario
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Verificar que el usuario es el dueño
  IF qr_record.owner_id != auth.uid() THEN
    RETURN false;
  END IF;
  
  -- Activar el QR
  UPDATE qr_codes 
  SET 
    pet_id = pet_id_param,
    status = 'active',
    activation_date = now()
  WHERE code = qr_code_text;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para registrar escaneo de QR
CREATE OR REPLACE FUNCTION register_qr_scan(
  qr_code_text text,
  scanner_ip_param inet DEFAULT NULL,
  scanner_user_agent_param text DEFAULT NULL,
  scan_location_param text DEFAULT NULL
)
RETURNS jsonb AS $$
DECLARE
  qr_record qr_codes%ROWTYPE;
  pet_record pets%ROWTYPE;
  owner_profile user_profiles%ROWTYPE;
  result jsonb;
BEGIN
  -- Buscar el QR code
  SELECT * INTO qr_record FROM qr_codes WHERE code = qr_code_text;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'message', 'QR code not found');
  END IF;
  
  -- Verificar que está activo
  IF qr_record.status != 'active' THEN
    RETURN jsonb_build_object('success', false, 'message', 'QR code is not active');
  END IF;
  
  -- Registrar el escaneo
  INSERT INTO qr_scans (qr_code_id, scanner_ip, scanner_user_agent, scan_location)
  VALUES (qr_record.id, scanner_ip_param, scanner_user_agent_param, scan_location_param);
  
  -- Actualizar contador de escaneos
  UPDATE qr_codes 
  SET 
    scan_count = scan_count + 1,
    last_scan_date = now(),
    last_scan_location = scan_location_param
  WHERE id = qr_record.id;
  
  -- Obtener información de la mascota
  SELECT * INTO pet_record FROM pets WHERE id = qr_record.pet_id;
  
  -- Obtener información del dueño
  SELECT * INTO owner_profile FROM user_profiles WHERE user_id = qr_record.owner_id;
  
  -- Construir respuesta
  result := jsonb_build_object(
    'success', true,
    'pet', jsonb_build_object(
      'name', pet_record.name,
      'species', pet_record.species,
      'breed', pet_record.breed,
      'color', pet_record.color,
      'photo_url', pet_record.photo_url,
      'medical_conditions', pet_record.medical_conditions,
      'special_needs', pet_record.special_needs
    ),
    'owner', jsonb_build_object(
      'name', owner_profile.first_name || ' ' || owner_profile.last_name,
      'phone', owner_profile.phone,
      'whatsapp', owner_profile.whatsapp,
      'emergency_contact_name', owner_profile.emergency_contact_name,
      'emergency_contact_phone', owner_profile.emergency_contact_phone
    )
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insertar datos de ejemplo para testing
INSERT INTO pets (owner_id, name, species, breed, color, size, medical_conditions) VALUES
  ((SELECT id FROM auth.users LIMIT 1), 'Luna', 'dog', 'Golden Retriever', 'Dorado', 'large', 'Ninguna conocida'),
  ((SELECT id FROM auth.users LIMIT 1), 'Max', 'dog', 'Labrador', 'Negro', 'large', 'Alergia a ciertos alimentos');

-- Insertar QR codes de ejemplo
INSERT INTO qr_codes (code, owner_id, qr_type, status, purchase_price) VALUES
  ('QR' || upper(substring(md5(random()::text) from 1 for 6)), (SELECT id FROM auth.users LIMIT 1), 'basic', 'inactive', 2500),
  ('QR' || upper(substring(md5(random()::text) from 1 for 6)), (SELECT id FROM auth.users LIMIT 1), 'basic', 'inactive', 2500);