-- Seed dummy owner and customer users
-- Passwords are hashed using bcrypt (cost factor: 12)
-- owner@123 -> $2b$12$.mZ0zRbZ6bFYKI.mcwv.MurZ9Lh67ZSYWui7KSnfIbE7LziUI2wMW
-- user@123 -> $2b$12$8m3ijOigr.HmNVcHxJvfjerZIQWb96by2ir5wsE0WHBncKQEUjp82

-- Insert dummy owner
INSERT INTO "Users" (email, password, "firstName", "lastName", phone, "roleId", "createdAt", "updatedAt")
VALUES (
  'owner@hotelbooker.com',
  '$2b$12$.mZ0zRbZ6bFYKI.mcwv.MurZ9Lh67ZSYWui7KSnfIbE7LziUI2wMW',
  'John',
  'Owner',
  '+1234567890',
  (SELECT id FROM "Roles" WHERE key = 'owner' LIMIT 1),
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Insert dummy customer
INSERT INTO "Users" (email, password, "firstName", "lastName", phone, "roleId", "createdAt", "updatedAt")
VALUES (
  'customer@hotelbooker.com',
  '$2b$12$8m3ijOigr.HmNVcHxJvfjerZIQWb96by2ir5wsE0WHBncKQEUjp82',
  'Jane',
  'Customer',
  '+0987654321',
  (SELECT id FROM "Roles" WHERE key = 'customer' LIMIT 1),
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;
