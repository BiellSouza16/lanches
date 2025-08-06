/*
  # Add visto column to Lanches table

  1. Changes to Table
    - Add `visto` column to `Lanches` table
    - Set default value to false for new records
    - Update existing records to have visto = false

  2. Security
    - No changes to RLS policies needed
*/

-- Add visto column to Lanches table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Lanches' AND column_name = 'visto'
  ) THEN
    ALTER TABLE "Lanches" ADD COLUMN visto boolean DEFAULT false;
  END IF;
END $$;

-- Update existing records to have visto = false if they don't have a value
UPDATE "Lanches" SET visto = false WHERE visto IS NULL;