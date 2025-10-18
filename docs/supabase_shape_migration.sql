-- =====================================================
-- COSMIC MINDMAP - NODE SHAPES MIGRATION
-- Adds shape support to existing nodes table
-- =====================================================

-- 1. Add shape column to nodes table
ALTER TABLE nodes 
ADD COLUMN IF NOT EXISTS shape VARCHAR(20) DEFAULT 'RECTANGLE';

-- 2. Add constraint to ensure valid shape values
ALTER TABLE nodes 
DROP CONSTRAINT IF EXISTS valid_node_shape;

ALTER TABLE nodes 
ADD CONSTRAINT valid_node_shape CHECK (
  shape IN (
    'RECTANGLE',
    'CIRCLE', 
    'ELLIPSE',
    'DIAMOND',
    'HEXAGON',
    'OCTAGON',
    'PARALLELOGRAM',
    'TRAPEZOID',
    'STAR',
    'CLOUD'
  )
);

-- 3. Add index for faster shape queries (optional)
CREATE INDEX IF NOT EXISTS idx_nodes_shape 
ON nodes(shape);

-- 4. Update existing nodes to have default shape
UPDATE nodes 
SET shape = 'RECTANGLE' 
WHERE shape IS NULL;

-- 5. Create function to log shape changes (optional analytics)
CREATE OR REPLACE FUNCTION log_shape_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.shape IS DISTINCT FROM NEW.shape THEN
    INSERT INTO shape_change_logs (
      node_id, 
      old_shape, 
      new_shape, 
      changed_at
    ) VALUES (
      NEW.node_id,
      OLD.shape,
      NEW.shape,
      NOW()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Create trigger for shape change logging (optional)
-- Uncomment if you want to track shape changes
/*
CREATE TABLE IF NOT EXISTS shape_change_logs (
  id SERIAL PRIMARY KEY,
  node_id INTEGER REFERENCES nodes(node_id) ON DELETE CASCADE,
  old_shape VARCHAR(20),
  new_shape VARCHAR(20),
  changed_at TIMESTAMP DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trigger_log_shape_change ON nodes;
CREATE TRIGGER trigger_log_shape_change
  AFTER UPDATE ON nodes
  FOR EACH ROW
  EXECUTE FUNCTION log_shape_change();
*/

-- 7. Grant permissions (adjust based on your RLS policies)
-- GRANT UPDATE (shape) ON nodes TO authenticated;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if shape column exists
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'nodes' AND column_name = 'shape';

-- Check constraint
SELECT constraint_name, check_clause
FROM information_schema.check_constraints
WHERE constraint_name = 'valid_node_shape';

-- Sample query: Count nodes by shape
SELECT shape, COUNT(*) as count
FROM nodes
GROUP BY shape
ORDER BY count DESC;

-- =====================================================
-- ROLLBACK SCRIPT (if needed)
-- =====================================================
/*
-- Remove shape column
ALTER TABLE nodes DROP COLUMN IF EXISTS shape;

-- Remove index
DROP INDEX IF EXISTS idx_nodes_shape;

-- Remove trigger and function
DROP TRIGGER IF EXISTS trigger_log_shape_change ON nodes;
DROP FUNCTION IF EXISTS log_shape_change();
DROP TABLE IF EXISTS shape_change_logs;
*/
