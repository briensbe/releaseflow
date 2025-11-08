/*
  # Create Events Table for Delivery and MEP Calendar

  1. New Tables
    - `events`
      - `id` (uuid, primary key) - Unique identifier for each event
      - `title` (text) - Event title (e.g., "LV 2025.4", "MEP 2025.3.5")
      - `event_type` (text) - Type of event: 'livraison' or 'mep'
      - `event_date` (date) - Date of the event
      - `description` (text) - Optional description of the event
      - `version` (text) - Version number (e.g., "2025.4", "2025.3.5")
      - `created_at` (timestamptz) - Timestamp of record creation
      - `updated_at` (timestamptz) - Timestamp of last update
      - created_by -> pas forcément utile pour le moment 

  2. Security
    - Enable RLS on `events` table
    - Add policies for public access (authenticated users can manage events)
    
  3. Notes
    - The event_type field helps distinguish between deliveries (livraison) and production releases (mep)
    - The version field stores the version number for easy filtering and display
    - Indexed on event_date for fast calendar queries
*/

-- 1. Création de la table (inchangée)
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('livraison', 'mep')),
  event_date date NOT NULL,
  description text DEFAULT '',
  version text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  -- Ajout d'un champ pour lier l'événement à son créateur
  -- created_by uuid REFERENCES auth.users(id) NOT NULL
);

-- 2. Indexes (inchangés)
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
-- CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);

-- 3. Activation de RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- 4. Politiques RLS sécurisées
-- Tout le monde peut lire tous les événements
CREATE POLICY "Allow public read access"
  ON events FOR SELECT
  TO public
  USING (true);

-- Insertion autorisée pour les authentifiés
CREATE POLICY "Allow authenticated insert access"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Mise à jour autorisée pour les authentifiés (sur tous les événements)
CREATE POLICY "Allow authenticated update access"
  ON events FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Suppression autorisée pour les authentifiés (sur tous les événements)
CREATE POLICY "Allow authenticated delete access"
  ON events FOR DELETE
  TO authenticated
  USING (true);

-- 5. Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_updated_at
BEFORE UPDATE ON events
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
