/*
  # Add User Roles and Documentation Tracking

  1. New Tables
    - `user_profiles` - Extended user data with roles
      - `id` (uuid, primary key, links to auth.users)
      - `email` (text, unique)
      - `full_name` (text)
      - `role` (text: admin or staff)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Modified Tables
    - `documentation_entries` - Add user tracking
      - `created_by` (uuid, foreign key to user_profiles)
      - `updated_by` (uuid, foreign key to user_profiles)

  3. Security
    - Enable RLS on both tables
    - Staff can only see their own entries
    - Admins can see all entries
    - Only admins can manage users
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'documentation_entries' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE documentation_entries ADD COLUMN created_by uuid REFERENCES user_profiles(id);
    ALTER TABLE documentation_entries ADD COLUMN updated_by uuid REFERENCES user_profiles(id);
  END IF;
END $$;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Only admins can insert users"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Only admins can delete users"
  ON user_profiles FOR DELETE
  TO authenticated
  USING ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Staff see own entries, admins see all"
  ON documentation_entries FOR SELECT
  TO authenticated
  USING (
    CASE 
      WHEN (SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin' THEN true
      ELSE created_by = auth.uid()
    END
  );

CREATE POLICY "Users can create entries"
  ON documentation_entries FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update own entries"
  ON documentation_entries FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can delete own entries"
  ON documentation_entries FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());
