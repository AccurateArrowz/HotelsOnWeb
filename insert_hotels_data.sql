-- Seed data: 10 hotels in Pokhara with associated room types and rooms
-- PostgreSQL JSONB syntax for amenities arrays

-- Hotels table population
INSERT INTO "Hotels" (name, description, street, city, country, amenities, rating, "isActive", "createdAt", "updatedAt") VALUES
('Pokhara Grand Hotel', 'Luxury hotel with mountain views and premium amenities', 'Lakeside Road 15', 'Pokhara', 'Nepal', '["Outdoor swimming pool", "Family rooms", "Free parking", "Restaurant", "Room service", "Bar", "Breakfast", "Elevator", "Fitness center", "Spa and wellness center", "Wifi"]', 4.5, true, NOW(), NOW()),

('Mountain View Resort', 'Scenic resort offering breathtaking Himalayan views', 'Phewa Lake Street 8', 'Pokhara', 'Nepal', '["Free parking", "Non-smoking rooms", "Restaurant", "Room service", "Breakfast", "Fitness center", "Spa and wellness center", "Wifi", "Airport Suite"]', 4.2, true, NOW(), NOW()),

('Lakeside Paradise Hotel', 'Charming hotel by the beautiful Phewa Lake', 'Baidam Road 22', 'Pokhara', 'Nepal', '["Outdoor swimming pool", "Family rooms", "Non-smoking rooms", "Restaurant", "Bar", "Breakfast", "Elevator", "Wifi"]', 4.0, true, NOW(), NOW()),

('Annapurna Comfort Inn', 'Comfortable accommodation with modern facilities', 'Mustang Chowk 5', 'Pokhara', 'Nepal', '["Family rooms", "Free parking", "Non-smoking rooms", "Restaurant", "Room service", "Breakfast", "Fitness center", "Wifi", "Airport Suite"]', 3.8, true, NOW(), NOW()),

('Himalayan Heights Hotel', 'Premium hotel with panoramic mountain views', 'Newroad 12', 'Pokhara', 'Nepal', '["Outdoor swimming pool", "Free parking", "Non-smoking rooms", "Restaurant", "Room service", "Bar", "Elevator", "Fitness center", "Spa and wellness center", "Wifi", "Airport Suite"]', 4.7, true, NOW(), NOW()),

('Phewa Lake Lodge', 'Cozy lodge with traditional Nepali hospitality', 'Lakeside 18', 'Pokhara', 'Nepal', '["Family rooms", "Free parking", "Restaurant", "Room service", "Bar", "Breakfast", "Wifi"]', 3.9, true, NOW(), NOW()),

('Royal Pokhara Hotel', 'Elegant hotel offering royal treatment and luxury', 'Simalchaur 3', 'Pokhara', 'Nepal', '["Outdoor swimming pool", "Family rooms", "Free parking", "Non-smoking rooms", "Restaurant", "Room service", "Bar", "Breakfast", "Elevator", "Fitness center", "Spa and wellness center", "Wifi", "Airport Suite"]', 4.6, true, NOW(), NOW()),

('Adventure Base Camp', 'Perfect for trekkers and adventure enthusiasts', 'Hemja 7', 'Pokhara', 'Nepal', '["Free parking", "Non-smoking rooms", "Restaurant", "Breakfast", "Fitness center", "Wifi", "Airport Suite"]', 3.7, true, NOW(), NOW()),

('Serenity Spa Resort', 'Tranquil resort focused on wellness and relaxation', 'Sarangkot Road 9', 'Pokhara', 'Nepal', '["Outdoor swimming pool", "Family rooms", "Non-smoking rooms", "Restaurant", "Room service", "Breakfast", "Elevator", "Spa and wellness center", "Wifi"]', 4.3, true, NOW(), NOW()),

('Valley View Hotel', 'Modern hotel with stunning valley perspectives', 'Prithvi Highway 25', 'Pokhara', 'Nepal', '["Family rooms", "Free parking", "Non-smoking rooms", "Restaurant", "Room service", "Bar", "Breakfast", "Elevator", "Fitness center", "Wifi"]', 4.1, true, NOW(), NOW());

-- RoomTypes table population with FK references to hotels
-- Hotel 1: Pokhara Grand Hotel
INSERT INTO "RoomTypes" ("hotelId", name, description, "basePrice", capacity, amenities, "isActive", "createdAt", "updatedAt") VALUES
(1, 'Standard Room', 'Comfortable room with basic amenities', 2500.00, 2, '["Air conditioning", "TV", "Mini fridge"]', true, NOW(), NOW()),
(1, 'Deluxe Room', 'Spacious room with mountain view', 4200.00, 3, '["Air conditioning", "TV", "Mini fridge", "Balcony", "Mountain view"]', true, NOW(), NOW()),
(1, 'Suite', 'Luxury suite with separate living area', 7800.00, 4, '["Air conditioning", "TV", "Mini fridge", "Balcony", "Mountain view", "Living area", "Jacuzzi"]', true, NOW(), NOW()),

-- Hotel 2: Mountain View Resort
(2, 'Standard Room', 'Cozy room with essential amenities', 2200.00, 2, '["Air conditioning", "TV", "WiFi"]', true, NOW(), NOW()),
(2, 'Premium Room', 'Enhanced room with better view', 3800.00, 3, '["Air conditioning", "TV", "WiFi", "Mountain view", "Mini bar"]', true, NOW(), NOW()),
(2, 'Family Suite', 'Large suite perfect for families', 6500.00, 6, '["Air conditioning", "TV", "WiFi", "Mountain view", "Mini bar", "Kitchenette"]', true, NOW(), NOW()),

-- Hotel 3: Lakeside Paradise Hotel
(3, 'Lake View Room', 'Room overlooking beautiful Phewa Lake', 3200.00, 2, '["Air conditioning", "TV", "Lake view", "Balcony"]', true, NOW(), NOW()),
(3, 'Garden Room', 'Peaceful room with garden access', 2800.00, 2, '["Air conditioning", "TV", "Garden view"]', true, NOW(), NOW()),
(3, 'Executive Suite', 'Premium suite with lake view', 5900.00, 4, '["Air conditioning", "TV", "Lake view", "Balcony", "Mini bar", "Work desk"]', true, NOW(), NOW()),

-- Hotel 4: Annapurna Comfort Inn
(4, 'Economy Room', 'Budget-friendly room with essentials', 1800.00, 2, '["TV", "WiFi"]', true, NOW(), NOW()),
(4, 'Standard Room', 'Comfortable room with modern amenities', 2600.00, 2, '["Air conditioning", "TV", "WiFi", "Mini fridge"]', true, NOW(), NOW()),
(4, 'Business Suite', 'Suite designed for business travelers', 4800.00, 3, '["Air conditioning", "TV", "WiFi", "Mini fridge", "Work desk", "Meeting area"]', true, NOW(), NOW()),

-- Hotel 5: Himalayan Heights Hotel
(5, 'Standard Room', 'Well-appointed room with city view', 3000.00, 2, '["Air conditioning", "TV", "WiFi", "City view"]', true, NOW(), NOW()),
(5, 'Deluxe Mountain View', 'Premium room with Himalayan views', 5200.00, 3, '["Air conditioning", "TV", "WiFi", "Mountain view", "Balcony", "Mini bar"]', true, NOW(), NOW()),
(5, 'Presidential Suite', 'Luxurious suite with panoramic views', 10500.00, 6, '["Air conditioning", "TV", "WiFi", "Mountain view", "Balcony", "Mini bar", "Jacuzzi", "Living area", "Dining area"]', true, NOW(), NOW()),

-- Hotel 6: Phewa Lake Lodge
(6, 'Traditional Room', 'Room with traditional Nepali decor', 2100.00, 2, '["TV", "Traditional decor"]', true, NOW(), NOW()),
(6, 'Lake Side Room', 'Room with direct lake access', 3500.00, 3, '["Air conditioning", "TV", "Lake view", "Balcony"]', true, NOW(), NOW()),

-- Hotel 7: Royal Pokhara Hotel
(7, 'Royal Standard', 'Elegantly designed standard room', 3400.00, 2, '["Air conditioning", "TV", "WiFi", "Mini bar"]', true, NOW(), NOW()),
(7, 'Royal Deluxe', 'Luxurious room with premium amenities', 5800.00, 3, '["Air conditioning", "TV", "WiFi", "Mini bar", "Balcony", "Mountain view"]', true, NOW(), NOW()),
(7, 'Royal Suite', 'Ultimate luxury suite experience', 9200.00, 5, '["Air conditioning", "TV", "WiFi", "Mini bar", "Balcony", "Mountain view", "Jacuzzi", "Butler service"]', true, NOW(), NOW()),

-- Hotel 8: Adventure Base Camp
(8, 'Dorm Bed', 'Shared accommodation for backpackers', 1200.00, 1, '["Shared bathroom", "Locker"]', true, NOW(), NOW()),
(8, 'Private Room', 'Simple private room for adventurers', 2000.00, 2, '["TV", "WiFi"]', true, NOW(), NOW()),
(8, 'Trekker Suite', 'Comfortable suite for trekking groups', 4000.00, 4, '["Air conditioning", "TV", "WiFi", "Gear storage"]', true, NOW(), NOW()),

-- Hotel 9: Serenity Spa Resort
(9, 'Wellness Room', 'Room designed for relaxation', 2900.00, 2, '["Air conditioning", "TV", "Aromatherapy", "Yoga mat"]', true, NOW(), NOW()),
(9, 'Spa Suite', 'Suite with in-room spa facilities', 6200.00, 3, '["Air conditioning", "TV", "Aromatherapy", "Yoga mat", "Private spa", "Balcony"]', true, NOW(), NOW()),

-- Hotel 10: Valley View Hotel
(10, 'Valley Room', 'Room with beautiful valley views', 2700.00, 2, '["Air conditioning", "TV", "Valley view"]', true, NOW(), NOW()),
(10, 'Premium Valley Suite', 'Spacious suite with panoramic valley views', 5500.00, 4, '["Air conditioning", "TV", "Valley view", "Balcony", "Mini bar", "Living area"]', true, NOW(), NOW());

-- Rooms table population with FK references to hotels and room types
-- Hotel 1 room allocation
INSERT INTO "Rooms" ("hotelId", "roomTypeId", "roomNumber", floor, status, "isActive", "createdAt", "updatedAt") VALUES
-- Standard tier
(1, 1, '101', 1, 'available', true, NOW(), NOW()),
(1, 1, '102', 1, 'available', true, NOW(), NOW()),
(1, 1, '103', 1, 'available', true, NOW(), NOW()),
(1, 1, '201', 2, 'available', true, NOW(), NOW()),
(1, 1, '202', 2, 'available', true, NOW(), NOW()),
-- Deluxe tier
(1, 2, '301', 3, 'available', true, NOW(), NOW()),
(1, 2, '302', 3, 'available', true, NOW(), NOW()),
(1, 2, '303', 3, 'available', true, NOW(), NOW()),
-- Suite tier
(1, 3, '401', 4, 'available', true, NOW(), NOW()),
(1, 3, '402', 4, 'available', true, NOW(), NOW()),

-- Hotel 2 room allocation
(2, 4, '101', 1, 'available', true, NOW(), NOW()),
(2, 4, '102', 1, 'available', true, NOW(), NOW()),
(2, 4, '103', 1, 'available', true, NOW(), NOW()),
(2, 5, '201', 2, 'available', true, NOW(), NOW()),
(2, 5, '202', 2, 'available', true, NOW(), NOW()),
(2, 6, '301', 3, 'available', true, NOW(), NOW()),

-- Hotel 3 room allocation
(3, 7, '101', 1, 'available', true, NOW(), NOW()),
(3, 7, '102', 1, 'available', true, NOW(), NOW()),
(3, 8, '201', 2, 'available', true, NOW(), NOW()),
(3, 8, '202', 2, 'available', true, NOW(), NOW()),
(3, 9, '301', 3, 'available', true, NOW(), NOW()),

-- Hotel 4 room allocation
(4, 10, '101', 1, 'available', true, NOW(), NOW()),
(4, 10, '102', 1, 'available', true, NOW(), NOW()),
(4, 11, '201', 2, 'available', true, NOW(), NOW()),
(4, 11, '202', 2, 'available', true, NOW(), NOW()),
(4, 12, '301', 3, 'available', true, NOW(), NOW()),

-- Hotel 5 room allocation
(5, 13, '101', 1, 'available', true, NOW(), NOW()),
(5, 13, '102', 1, 'available', true, NOW(), NOW()),
(5, 14, '201', 2, 'available', true, NOW(), NOW()),
(5, 14, '202', 2, 'available', true, NOW(), NOW()),
(5, 15, '501', 5, 'available', true, NOW(), NOW()),

-- Hotel 6 room allocation
(6, 16, '101', 1, 'available', true, NOW(), NOW()),
(6, 16, '102', 1, 'available', true, NOW(), NOW()),
(6, 17, '201', 2, 'available', true, NOW(), NOW()),
(6, 17, '202', 2, 'available', true, NOW(), NOW()),

-- Hotel 7 room allocation
(7, 18, '101', 1, 'available', true, NOW(), NOW()),
(7, 18, '102', 1, 'available', true, NOW(), NOW()),
(7, 19, '201', 2, 'available', true, NOW(), NOW()),
(7, 19, '202', 2, 'available', true, NOW(), NOW()),
(7, 20, '301', 3, 'available', true, NOW(), NOW()),

-- Hotel 8 room allocation
(8, 21, 'D01', 1, 'available', true, NOW(), NOW()),
(8, 21, 'D02', 1, 'available', true, NOW(), NOW()),
(8, 22, '101', 1, 'available', true, NOW(), NOW()),
(8, 22, '102', 1, 'available', true, NOW(), NOW()),
(8, 23, '201', 2, 'available', true, NOW(), NOW()),

-- Hotel 9 room allocation
(9, 24, '101', 1, 'available', true, NOW(), NOW()),
(9, 24, '102', 1, 'available', true, NOW(), NOW()),
(9, 25, '201', 2, 'available', true, NOW(), NOW()),
(9, 25, '202', 2, 'available', true, NOW(), NOW()),

-- Hotel 10 room allocation
(10, 26, '101', 1, 'available', true, NOW(), NOW()),
(10, 26, '102', 1, 'available', true, NOW(), NOW()),
(10, 27, '201', 2, 'available', true, NOW(), NOW()),
(10, 27, '202', 2, 'available', true, NOW(), NOW());
