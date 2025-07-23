CREATE OR REPLACE FUNCTION set_timestamps()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW."createdAt" IS NULL THEN
      NEW."createdAt" := NOW();
    END IF;
    IF NEW."updatedAt" IS NULL THEN
      NEW."updatedAt" := NOW();
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    NEW."updatedAt" := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_timestamps_users ON "Users";
CREATE TRIGGER set_timestamps_users
BEFORE INSERT OR UPDATE ON "Users"
FOR EACH ROW EXECUTE FUNCTION set_timestamps();

DROP TRIGGER IF EXISTS set_timestamps_hotels ON "Hotels";
CREATE TRIGGER set_timestamps_hotels
BEFORE INSERT OR UPDATE ON "Hotels"
FOR EACH ROW EXECUTE FUNCTION set_timestamps();

-- Repeat for each table with createdAt/updatedAt:
DROP TRIGGER IF EXISTS set_timestamps_roomtypes ON "RoomTypes";
CREATE TRIGGER set_timestamps_roomtypes
BEFORE INSERT OR UPDATE ON "RoomTypes"
FOR EACH ROW EXECUTE FUNCTION set_timestamps();

DROP TRIGGER IF EXISTS set_timestamps_rooms ON "Rooms";
CREATE TRIGGER set_timestamps_rooms
BEFORE INSERT OR UPDATE ON "Rooms"
FOR EACH ROW EXECUTE FUNCTION set_timestamps();

DROP TRIGGER IF EXISTS set_timestamps_hotelimages ON "HotelImages";
CREATE TRIGGER set_timestamps_hotelimages
BEFORE INSERT OR UPDATE ON "HotelImages"
FOR EACH ROW EXECUTE FUNCTION set_timestamps();