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

  2. Security
    - Enable RLS on `events` table
    - Add policies for public access (authenticated users can manage events)
    
  3. Notes
    - The event_type field helps distinguish between deliveries (livraison) and production releases (mep)
    - The version field stores the version number for easy filtering and display
    - Indexed on event_date for fast calendar queries
*/

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('livraison', 'mep')),
  event_date date NOT NULL,
  description text DEFAULT '',
  version text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON events FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access"
  ON events FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access"
  ON events FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access"
  ON events FOR DELETE
  TO public
  USING (true);