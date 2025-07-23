
-- Insert Users (replace password hashes with real bcrypt hashes as needed)
INSERT INTO "Users" (email, password, "firstName", "lastName", phone, role, "isEmailVerified") VALUES
  ('admin@hotelsonweb.com',    '$2a$12$adminhash', 'Admin',  'User',   '+977-1-4444444', 'admin',      true),
  ('john.doe@example.com',     '$2a$12$user1hash', 'John',   'Doe',    '+977-1-5555555', 'user',       true),
  ('jane.smith@example.com',   '$2a$12$user2hash', 'Jane',   'Smith',  '+977-1-6666666', 'user',       true),
  ('ram.shrestha@dwarika.com', '$2a$12$ownerhash', 'Ram',    'Shrestha', '+977-1-7777777', 'hotelOwner', true),
  ('sita.thapa@yak.com',       '$2a$12$ownerhash2', 'Sita',  'Thapa',   '+977-1-8888888', 'hotelOwner', true),
  ('bikram.rai@soaltee.com',   '$2a$12$ownerhash3', 'Bikram', 'Rai',    '+977-1-9999999', 'hotelOwner', true),
  ('anjali.kc@hyatt.com',      '$2a$12$ownerhash4', 'Anjali', 'KC',     '+977-1-1111111', 'hotelOwner', true),
  ('prakash.gurung@everest.com', '$2a$12$ownerhash5', 'Prakash', 'Gurung', '+977-1-2222222', 'hotelOwner', true),
  ('guest@example.com',        '$2a$12$guesthash', 'Guest',  'User',   '+977-1-3333333', 'guest',      false);

-- Insert Hotels
INSERT INTO "Hotels" ("hotelId", name, description, street, city, country, amenities, rating, "isActive") VALUES
  ('DWH-123456', 'Nepal Heritage Palace', 'A luxury heritage hotel in Kathmandu that showcases traditional Nepali architecture and culture. Experience authentic Nepali hospitality with modern comforts.', 'Battisputali, Kathmandu', 'Kathmandu', 'Nepal', '["WiFi","Spa","Traditional Restaurant","Cultural Tours","Garden","Yoga Classes","Art Gallery","Concierge"]', 4.9, true),
  ('YH-789012', 'Himalayan Grand Resort', 'Historic luxury hotel in the heart of Kathmandu, combining traditional Nepali charm with world-class amenities and service.', 'Durbar Marg, Kathmandu', 'Kathmandu', 'Nepal', '["WiFi","Pool","Spa","Multiple Restaurants","Bar","Business Center","Gym","Concierge"]', 4.7, true),
  ('SH-345678', 'Royal Mountain Lodge', 'Premier 5-star hotel offering luxury accommodations with stunning views of the Himalayas and Kathmandu Valley.', 'Tahachal, Kathmandu', 'Kathmandu', 'Nepal', '["WiFi","Pool","Spa","Golf Course","Multiple Restaurants","Bar","Kids Club","Concierge"]', 4.8, true),
  ('HHR-901234', 'Sacred Valley Retreat', 'Modern luxury hotel with traditional Nepali touches, located near the sacred Boudhanath Stupa.', 'Boudha, Kathmandu', 'Kathmandu', 'Nepal', '["WiFi","Pool","Spa","Restaurant","Bar","Fitness Center","Garden","Concierge"]', 4.6, true),
  ('EVR-567890', 'Everest Summit Lodge', 'World''s highest placed hotel offering breathtaking views of Mount Everest and the Himalayan range.', 'Syangboche, Namche Bazaar', 'Solukhumbu', 'Nepal', '["Mountain Views","Restaurant","Bar","Helicopter Access","Hiking Tours","Traditional Decor","Heating","Limited WiFi"]', 4.5, true),
  ('PH-111111', 'Annapurna Lakeside Resort', 'Lakeside luxury hotel with stunning views of Phewa Lake and the Annapurna mountain range.', 'Lakeside, Pokhara', 'Pokhara', 'Nepal', '["Lake View","Pool","Spa","Restaurant","Bar","Boat Tours","Garden","WiFi"]', 4.4, true),
  ('BH-222222', 'Wildlife Sanctuary Lodge', 'Eco-friendly boutique hotel in the heart of Chitwan National Park, perfect for wildlife enthusiasts.', 'Thakurdwara, Chitwan', 'Chitwan', 'Nepal', '["Wildlife Tours","Eco-Friendly","Restaurant","Garden","Jungle Safaris","Traditional Decor","WiFi","Guided Tours"]', 4.3, true);

-- Insert RoomTypes (assumes hotel IDs 1-7)
INSERT INTO "RoomTypes" ("hotelId", name, description, "basePrice", capacity, amenities, "isActive") VALUES
  (1, 'Heritage Deluxe Room', 'Traditional Nepali-style room with hand-carved wooden furniture and modern amenities.', 15000.00, 2, '["Traditional Decor","King Bed","Garden View","Mini Bar","Room Service","Free WiFi","Cultural Touches"]', true),
  (1, 'Nepal Heritage Suite', 'Luxurious suite featuring traditional Nepali architecture with separate living area and private courtyard.', 35000.00, 4, '["Private Courtyard","Separate Living Room","King Bed","Traditional Bath","Butler Service","Premium WiFi","Cultural Experience"]', true),
  (1, 'Royal Heritage Villa', 'Ultimate luxury villa with traditional Nepali design, private pool, and personalized cultural experiences.', 50000.00, 6, '["Private Pool","Traditional Architecture","Butler Service","Private Dining","Cultural Tours","Luxury Bath","Garden Access"]', true),
  (2, 'Classic Mountain Room', 'Elegant room with traditional Nepali charm and modern comforts in the heart of Kathmandu.', 12000.00, 2, '["Traditional Charm","Queen Bed","City View","Free WiFi","Room Service"]', true),
  (2, 'Himalayan Executive Suite', 'Spacious suite with separate living area and premium amenities in historic surroundings.', 28000.00, 4, '["Separate Living Room","King Bed","Sofa Bed","Executive Lounge","Premium WiFi","City Views"]', true),
  (3, 'Mountain View Room', 'Room with stunning views of the Himalayas and Kathmandu Valley.', 18000.00, 2, '["Mountain Views","King Bed","Balcony","Free WiFi","Room Service","Premium Amenities"]', true),
  (3, 'Royal Presidential Suite', 'Ultimate luxury with panoramic mountain views and exclusive services.', 45000.00, 6, '["Panoramic Mountain Views","Private Terrace","Butler Service","Private Dining","Luxury Bath","Exclusive Access"]', true),
  (4, 'Sacred Valley Room', 'Modern room with traditional Nepali touches near the sacred Boudhanath Stupa.', 14000.00, 2, '["Modern Design","Queen Bed","Stupa Views","Free WiFi","Fitness Access"]', true),
  (4, 'Valley Retreat Suite', 'Spacious suite with traditional elements and modern luxury amenities.', 32000.00, 4, '["Separate Living Area","King Bed","Stupa Views","Premium WiFi","Spa Access"]', true),
  (5, 'Everest View Room', 'Room with direct views of Mount Everest and the Himalayan range.', 10000.00, 2, '["Everest Views","Twin Beds","Mountain Decor","Restaurant Access","Limited WiFi","Heating"]', true),
  (5, 'Summit Mountain Suite', 'Spacious suite with panoramic mountain views and traditional Sherpa hospitality.', 25000.00, 4, '["Panoramic Views","King Bed","Traditional Decor","Private Dining","Mountain Tours","Heating"]', true),
  (6, 'Lakeside Room', 'Room with beautiful views of Phewa Lake and the Annapurna range.', 11000.00, 2, '["Lake Views","Queen Bed","Balcony","Free WiFi","Boat Access"]', true),
  (6, 'Annapurna Luxury Suite', 'Luxury suite with stunning lake and mountain views.', 22000.00, 4, '["Lake & Mountain Views","King Bed","Private Balcony","Premium WiFi","Spa Access"]', true),
  (7, 'Jungle Room', 'Eco-friendly room with traditional Tharu design elements.', 8000.00, 2, '["Traditional Tharu Design","Queen Bed","Garden View","Eco-Friendly","WiFi","Wildlife Tours"]', true),
  (7, 'Wildlife Sanctuary Suite', 'Spacious suite perfect for wildlife enthusiasts with jungle views.', 16000.00, 4, '["Jungle Views","King Bed","Traditional Decor","Wildlife Tours","Garden Access","Eco-Friendly"]', true);

-- Insert HotelImages (assumes hotel IDs 1-7)
INSERT INTO "HotelImages" ("hotelId", "imageUrl", caption, "isPrimary", "orderIndex") VALUES
  (1, 'https://placehold.co/600x400?text=Nepal+Heritage+Palace+Exterior', 'Nepal Heritage Palace Exterior', true, 1),
  (1, 'https://placehold.co/600x400?text=Heritage+Deluxe+Room', 'Heritage Deluxe Room', false, 2),
  (1, 'https://placehold.co/600x400?text=Nepal+Heritage+Suite+Courtyard', 'Nepal Heritage Suite Courtyard', false, 3),
  (1, 'https://placehold.co/600x400?text=Traditional+Restaurant', 'Traditional Restaurant', false, 4),
  (1, 'https://placehold.co/600x400?text=Spa+and+Wellness', 'Spa and Wellness Center', false, 5),
  (2, 'https://placehold.co/600x400?text=Himalayan+Grand+Resort+Exterior', 'Himalayan Grand Resort Exterior', true, 1),
  (2, 'https://placehold.co/600x400?text=Classic+Mountain+Room', 'Classic Mountain Room', false, 2),
  (2, 'https://placehold.co/600x400?text=Himalayan+Executive+Suite', 'Himalayan Executive Suite', false, 3),
  (2, 'https://placehold.co/600x400?text=Hotel+Lobby', 'Hotel Lobby', false, 4),
  (2, 'https://placehold.co/600x400?text=Restaurant', 'Restaurant', false, 5),
  (3, 'https://placehold.co/600x400?text=Royal+Mountain+Lodge+Exterior', 'Royal Mountain Lodge Exterior', true, 1),
  (3, 'https://placehold.co/600x400?text=Mountain+View+Room', 'Mountain View Room', false, 2),
  (3, 'https://placehold.co/600x400?text=Royal+Presidential+Suite', 'Royal Presidential Suite', false, 3),
  (3, 'https://placehold.co/600x400?text=Golf+Course', 'Golf Course', false, 4),
  (3, 'https://placehold.co/600x400?text=Pool+Area', 'Pool Area', false, 5),
  (4, 'https://placehold.co/600x400?text=Sacred+Valley+Retreat+Exterior', 'Sacred Valley Retreat Exterior', true, 1),
  (4, 'https://placehold.co/600x400?text=Sacred+Valley+Room', 'Sacred Valley Room', false, 2),
  (4, 'https://placehold.co/600x400?text=Valley+Retreat+Suite', 'Valley Retreat Suite', false, 3),
  (4, 'https://placehold.co/600x400?text=Boudhanath+Stupa+View', 'Boudhanath Stupa View', false, 4),
  (4, 'https://placehold.co/600x400?text=Spa+Center', 'Spa Center', false, 5),
  (5, 'https://placehold.co/600x400?text=Everest+Summit+Lodge', 'Everest Summit Lodge', true, 1),
  (5, 'https://placehold.co/600x400?text=Everest+View+Room', 'Everest View Room', false, 2),
  (5, 'https://placehold.co/600x400?text=Summit+Mountain+Suite', 'Summit Mountain Suite', false, 3),
  (5, 'https://placehold.co/600x400?text=Himalayan+Views', 'Himalayan Views', false, 4),
  (5, 'https://placehold.co/600x400?text=Restaurant+with+Views', 'Restaurant with Views', false, 5),
  (6, 'https://placehold.co/600x400?text=Annapurna+Lakeside+Resort+Exterior', 'Annapurna Lakeside Resort Exterior', true, 1),
  (6, 'https://placehold.co/600x400?text=Lakeside+Room', 'Lakeside Room', false, 2),
  (6, 'https://placehold.co/600x400?text=Annapurna+Luxury+Suite', 'Annapurna Luxury Suite', false, 3),
  (6, 'https://placehold.co/600x400?text=Phewa+Lake+View', 'Phewa Lake View', false, 4),
  (6, 'https://placehold.co/600x400?text=Boat+Tours', 'Boat Tours', false, 5),
  (7, 'https://placehold.co/600x400?text=Wildlife+Sanctuary+Lodge', 'Wildlife Sanctuary Lodge', true, 1),
  (7, 'https://placehold.co/600x400?text=Jungle+Room', 'Jungle Room', false, 2),
  (7, 'https://placehold.co/600x400?text=Wildlife+Sanctuary+Suite', 'Wildlife Sanctuary Suite', false, 3),
  (7, 'https://placehold.co/600x400?text=Chitwan+National+Park', 'Chitwan National Park', false, 4),
  (7, 'https://placehold.co/600x400?text=Wildlife+Safari', 'Wildlife Safari', false, 5);

-- Insert Rooms (example for a few rooms; expand as needed)
INSERT INTO "Rooms" ("roomId", "hotelId", "roomTypeId", "roomNumber", floor, status, "isActive") VALUES
  ('DWH-123456-101-5678', 1, 1, '101', 1, 'available', true),
  ('DWH-123456-102-1234', 1, 1, '102', 1, 'available', true),
  ('DWH-123456-201-4321', 1, 2, '201', 2, 'available', true),
  ('DWH-123456-202-8765', 1, 2, '202', 2, 'available', true),
  ('DWH-123456-301-1111', 1, 3, '301', 3, 'available', true),
  ('YH-789012-101-2222', 2, 4, '101', 1, 'available', true),
  ('YH-789012-102-3333', 2, 4, '102', 1, 'available', true),
  ('YH-789012-201-4444', 2, 5, '201', 2, 'available', true),
  ('YH-789012-202-5555', 2, 5, '202', 2, 'available', true),
  ('SH-345678-101-6666', 3, 6, '101', 1, 'available', true),
  ('SH-345678-102-7777', 3, 6, '102', 1, 'available', true),
  ('SH-345678-201-8888', 3, 7, '201', 2, 'available', true),
  ('HHR-901234-101-9999', 4, 8, '101', 1, 'available', true),
  ('HHR-901234-102-0000', 4, 8, '102', 1, 'available', true),
  ('HHR-901234-201-1111', 4, 9, '201', 2, 'available', true),
  ('EVR-567890-101-2222', 5, 10, '101', 1, 'available', true),
  ('EVR-567890-102-3333', 5, 10, '102', 1, 'available', true),
  ('EVR-567890-201-4444', 5, 11, '201', 2, 'available', true),
  ('PH-111111-101-5555', 6, 12, '101', 1, 'available', true),
  ('PH-111111-102-6666', 6, 12, '102', 1, 'available', true),
  ('PH-111111-201-7777', 6, 13, '201', 2, 'available', true),
  ('BH-222222-101-8888', 7, 14, '101', 1, 'available', true),
  ('BH-222222-102-9999', 7, 14, '102', 1, 'available', true),
  ('BH-222222-201-0000', 7, 15, '201', 2, 'available', true);
-- Add more room rows as needed for your data 