'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const roomTypes = [
      // Kathmandu Hotels
      { hotelId: 26, name: 'Standard Room', description: 'Comfortable room with city views', basePrice: 3500.00, adults: 2, children: 1 },
      { hotelId: 26, name: 'Deluxe Room', description: 'Spacious room with modern amenities', basePrice: 5500.00, adults: 2, children: 2 },
      { hotelId: 26, name: 'Suite', description: 'Premium suite with separate living area', basePrice: 8500.00, adults: 3, children: 2 },

      { hotelId: 19, name: 'Mountain View Room', description: 'Room with Himalayan mountain views', basePrice: 4500.00, adults: 2, children: 1 },
      { hotelId: 19, name: 'Heritage Room', description: 'Traditional Nepali decor with modern comfort', basePrice: 6000.00, adults: 2, children: 2 },

      { hotelId: 21, name: 'Courtyard Room', description: 'Room overlooking traditional courtyard', basePrice: 4000.00, adults: 2, children: 1 },
      { hotelId: 21, name: 'Cultural Suite', description: 'Themed room showcasing Nepali culture', basePrice: 7000.00, adults: 3, children: 2 },

      { hotelId: 14, name: 'Urban Room', description: 'Modern room in city center', basePrice: 3800.00, adults: 2, children: 1 },
      { hotelId: 14, name: 'Executive Room', description: 'Business-friendly room with workspace', basePrice: 5800.00, adults: 2, children: 1 },

      { hotelId: 23, name: 'City Room', description: 'Convenient room in midtown location', basePrice: 3200.00, adults: 2, children: 1 },
      { hotelId: 23, name: 'Family Room', description: 'Spacious room for families', basePrice: 5000.00, adults: 3, children: 2 },

      { hotelId: 11, name: 'Valley View Room', description: 'Room with Kathmandu Valley views', basePrice: 4200.00, adults: 2, children: 1 },
      { hotelId: 11, name: 'Premium Room', description: 'Upgraded room with balcony', basePrice: 6200.00, adults: 2, children: 2 },

      { hotelId: 29, name: 'Traditional Room', description: 'Room with traditional Newari architecture', basePrice: 3600.00, adults: 2, children: 1 },
      { hotelId: 29, name: 'Courtyard Suite', description: 'Suite with private courtyard access', basePrice: 6500.00, adults: 3, children: 2 },

      { hotelId: 32, name: 'Yak Room', description: 'Cozy room with Tibetan-inspired decor', basePrice: 4000.00, adults: 2, children: 1 },
      { hotelId: 32, name: 'Royal Room', description: 'Premium room with luxury amenities', basePrice: 6800.00, adults: 2, children: 2 },

      { hotelId: 9, name: 'Comfort Room', description: 'Budget-friendly comfortable room', basePrice: 2800.00, adults: 2, children: 1 },
      { hotelId: 9, name: 'Premium Comfort', description: 'Enhanced comfort room', basePrice: 4200.00, adults: 2, children: 1 },

      { hotelId: 35, name: 'Heights Room', description: 'Room with panoramic city views', basePrice: 4800.00, adults: 2, children: 1 },
      { hotelId: 35, name: 'Skyline Suite', description: 'Suite with skyline views', basePrice: 7500.00, adults: 3, children: 2 },

      // Pokhara Hotels
      { hotelId: 25, name: 'Lake View Room', description: 'Room overlooking Phewa Lake', basePrice: 4500.00, adults: 2, children: 1 },
      { hotelId: 25, name: 'Mountain Room', description: 'Room with Annapurna range views', basePrice: 5500.00, adults: 2, children: 2 },

      { hotelId: 31, name: 'Garden Room', description: 'Room surrounded by lush gardens', basePrice: 3800.00, adults: 2, children: 1 },
      { hotelId: 31, name: 'Evergreen Suite', description: 'Spacious suite with garden views', basePrice: 6200.00, adults: 3, children: 2 },

      { hotelId: 17, name: 'Pagoda Room', description: 'Room with pagoda-style architecture', basePrice: 4200.00, adults: 2, children: 1 },
      { hotelId: 17, name: 'Heights Suite', description: 'Suite with mountain views', basePrice: 6800.00, adults: 3, children: 2 },

      { hotelId: 37, name: 'Lotus Room', description: 'Peaceful room inspired by lotus flower', basePrice: 4000.00, adults: 2, children: 1 },
      { hotelId: 37, name: 'White Suite', description: 'Elegant suite with lake views', basePrice: 6500.00, adults: 3, children: 2 },

      { hotelId: 28, name: 'Sunset Room', description: 'Room perfect for sunset viewing', basePrice: 4600.00, adults: 2, children: 1 },
      { hotelId: 28, name: 'Sunset Suite', description: 'Suite with sunset balcony', basePrice: 7200.00, adults: 3, children: 2 },

      { hotelId: 20, name: 'Lakeside Room', description: 'Room near the lakeside', basePrice: 4300.00, adults: 2, children: 1 },
      { hotelId: 20, name: 'Tranquil Suite', description: 'Peaceful suite with lake access', basePrice: 7000.00, adults: 3, children: 2 },

      { hotelId: 33, name: 'Serenity Room', description: 'Quiet room for relaxation', basePrice: 4100.00, adults: 2, children: 1 },
      { hotelId: 33, name: 'Lake Suite', description: 'Suite with direct lake views', basePrice: 6600.00, adults: 3, children: 2 },

      { hotelId: 13, name: 'Echo Room', description: 'Room with mountain echo views', basePrice: 4400.00, adults: 2, children: 1 },
      { hotelId: 13, name: 'Mountain Suite', description: 'Suite with panoramic mountain views', basePrice: 7100.00, adults: 3, children: 2 },

      { hotelId: 16, name: 'Breeze Room', description: 'Room with cool lake breeze', basePrice: 3900.00, adults: 2, children: 1 },
      { hotelId: 16, name: 'Lakeside Suite', description: 'Suite with private lake access', basePrice: 6400.00, adults: 3, children: 2 },

      { hotelId: 8, name: 'Riverside Room', description: 'Room near the riverside', basePrice: 3700.00, adults: 2, children: 1 },
      { hotelId: 8, name: 'Retreat Suite', description: 'Suite with river views', basePrice: 6000.00, adults: 3, children: 2 },

      // Chitwan Hotels
      { hotelId: 12, name: 'Garden Room', description: 'Room in peaceful garden setting', basePrice: 3500.00, adults: 2, children: 1 },
      { hotelId: 12, name: 'Nature Suite', description: 'Suite with jungle views', basePrice: 5800.00, adults: 3, children: 2 },

      { hotelId: 24, name: 'Forest Room', description: 'Room surrounded by forest', basePrice: 3800.00, adults: 2, children: 1 },
      { hotelId: 24, name: 'Retreat Room', description: 'Private room in forest setting', basePrice: 5200.00, adults: 2, children: 2 },

      { hotelId: 36, name: 'River Room', description: 'Room near Rapti River', basePrice: 4000.00, adults: 2, children: 1 },
      { hotelId: 36, name: 'Meghauli Suite', description: 'Premium suite with river views', basePrice: 6300.00, adults: 3, children: 2 },

      { hotelId: 30, name: 'Hills Room', description: 'Room with hill views', basePrice: 3600.00, adults: 2, children: 1 },
      { hotelId: 30, name: 'Green Suite', description: 'Suite surrounded by greenery', basePrice: 5900.00, adults: 3, children: 2 },

      { hotelId: 22, name: 'Safari Room', description: 'Room designed for safari travelers', basePrice: 4500.00, adults: 2, children: 1 },
      { hotelId: 22, name: 'Deluxe Safari', description: 'Premium safari-themed room', basePrice: 6800.00, adults: 3, children: 2 },

      { hotelId: 18, name: 'Royal Safari Room', description: 'Luxury safari-themed room', basePrice: 5000.00, adults: 2, children: 2 },
      { hotelId: 18, name: 'Safari Suite', description: 'Full safari experience suite', basePrice: 7500.00, adults: 4, children: 2 },

      { hotelId: 27, name: 'Safari Camp Room', description: 'Room with camp-style accommodation', basePrice: 4200.00, adults: 2, children: 1 },
      { hotelId: 27, name: 'Sundari Suite', description: 'Beautiful suite with nature views', basePrice: 6600.00, adults: 3, children: 2 },

      { hotelId: 34, name: 'Peace Camp Room', description: 'Peaceful room in camp setting', basePrice: 3900.00, adults: 2, children: 1 },
      { hotelId: 34, name: 'Camp Suite', description: 'Luxury camp-style suite', basePrice: 6100.00, adults: 3, children: 2 },

      { hotelId: 10, name: 'Jungle Room', description: 'Room with jungle views', basePrice: 3700.00, adults: 2, children: 1 },
      { hotelId: 10, name: 'Breeze Suite', description: 'Suite with natural breeze', basePrice: 5700.00, adults: 3, children: 2 },

      { hotelId: 15, name: 'Tharu Room', description: 'Room with Tharu cultural decor', basePrice: 3600.00, adults: 2, children: 1 },
      { hotelId: 15, name: 'Heritage Suite', description: 'Suite showcasing Tharu heritage', basePrice: 5900.00, adults: 3, children: 2 },
    ];

    await queryInterface.bulkInsert('RoomTypes', roomTypes, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('RoomTypes', null, {});
  }
};
