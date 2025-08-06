/*
  # Create launches table for Coxinha Real system

  1. New Tables
    - `launches`
      - `id` (uuid, primary key) - Unique identifier for each launch
      - `type` (text) - Type of launch: 'lanche', 'perda', 'sobra', or 'estoque'
      - `employee_name` (text) - Name of the employee making the entry
      - `products` (jsonb) - JSON object containing product names and quantities
      - `juice` (text, nullable) - Type of juice: 'caja' or 'acerola'
      - `juice_quantity` (integer, nullable) - Quantity of juice
      - `timestamp` (timestamptz) - Full timestamp of when the entry was made
      - `date` (date) - Date portion for easy filtering
      - `time` (time) - Time portion for display
      - `created_at` (timestamptz) - Auto-generated creation timestamp

  2. Security
    - Enable RLS on `launches` table
    - Add policy for public access (since this is an internal system)

  3. Indexes
    - Index on date for efficient filtering
    - Index on type for statistics queries
*/

-- Create the launches table
CREATE TABLE IF NOT EXISTS launches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  employee_name text NOT NULL,
  products jsonb NOT NULL DEFAULT '{}',
  juice text,
  juice_quantity integer,
  timestamp timestamptz NOT NULL,
  date date NOT NULL,
  time time NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE launches ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (internal system)
CREATE POLICY "Allow all operations on launches"
  ON launches
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_launches_date ON launches(date);
CREATE INDEX IF NOT EXISTS idx_launches_type ON launches(type);
CREATE INDEX IF NOT EXISTS idx_launches_created_at ON launches(created_at);