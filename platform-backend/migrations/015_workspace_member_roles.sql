ALTER TABLE workspace_members
  MODIFY role VARCHAR(16) NOT NULL DEFAULT 'member';

UPDATE workspace_members
   SET role = 'admin'
 WHERE role = 'owner';
