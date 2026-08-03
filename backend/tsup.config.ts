import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    server: 'src/server.ts',
    app: 'src/app.ts',
    'models/User': 'src/models/User.ts',
    'models/Hotel': 'src/models/Hotel.ts',
    'models/HotelImage': 'src/models/HotelImage.ts',
    'models/RoomType': 'src/models/RoomType.ts',
    'models/Room': 'src/models/Room.ts',
    'models/Booking': 'src/models/Booking.ts',
    'models/BookingRoom': 'src/models/BookingRoom.ts',
    'models/HotelRequest': 'src/models/HotelRequest.ts',
    'models/HotelRequestImage': 'src/models/HotelRequestImage.ts',
    'models/Role': 'src/models/Role.ts',
    'models/Permission': 'src/models/Permission.ts',
    'models/RolePermission': 'src/models/RolePermission.ts',
    'models/HotelOwner': 'src/models/HotelOwner.ts',
    'models/HotelStaff': 'src/models/HotelStaff.ts',
    'models/HotelStaffPermission': 'src/models/HotelStaffPermission.ts',
    'models/RefreshToken': 'src/models/RefreshToken.ts',
  },
  format: ['cjs'],
  target: 'es2022',
  outDir: 'dist',
  sourcemap: true,
  clean: true,
  shims: false,
  splitting: false,
  bundle: false,
  esbuildOptions(options) {
    options.banner = {
      js: 'require("reflect-metadata");',
    };
  },
});
