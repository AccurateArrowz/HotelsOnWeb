-- Addi latitude and longitude columns to Hotels table
-- This will enable distance tracking and location-based features

-- Add the new columns
ALTER TABLE "Hotels" 
ADD COLUMN latitude DECIMAL(10, 8),
ADD COLUMN longitude DECIMAL(11, 8);

-- Update existing hotels with realistic coordinates for Nepal
-- Coordinates are in decimal degrees (latitude, longitude)

-- Nepal Heritage Palace - Kathmandu (Battisputali area)
UPDATE "Hotels" 
SET latitude = 27.7172, longitude = 85.3240 
WHERE "hotelId" = 'DWH-123456';

-- Himalayan Grand Resort - Kathmandu (Durbar Marg area)
UPDATE "Hotels" 
SET latitude = 27.7172, longitude = 85.3240 
WHERE "hotelId" = 'YH-789012';

-- Royal Mountain Lodge - Kathmandu (Tahachal area)
UPDATE "Hotels" 
SET latitude = 27.7172, longitude = 85.3240 
WHERE "hotelId" = 'SH-345678';

-- Sacred Valley Retreat - Kathmandu (Boudha area)
UPDATE "Hotels" 
SET latitude = 27.7218, longitude = 85.3616 
WHERE "hotelId" = 'HHR-901234';

-- Everest Summit Lodge - Solukhumbu (Namche Bazaar area)
UPDATE "Hotels" 
SET latitude = 27.8044, longitude = 86.7089 
WHERE "hotelId" = 'EVR-567890';

-- Annapurna Lakeside Resort - Pokhara (Lakeside area)
UPDATE "Hotels" 
SET latitude = 28.2096, longitude = 83.9856 
WHERE "hotelId" = 'PH-111111';

-- Wildlife Sanctuary Lodge - Chitwan (Thakurdwara area)
UPDATE "Hotels" 
SET latitude = 27.5800, longitude = 84.5000 
WHERE "hotelId" = 'BH-222222';

-- Add NOT NULL constraint after updating all records
-- Uncomment the following lines after ensuring all hotels have coordinates:
-- ALTER TABLE "Hotels" ALTER COLUMN latitude SET NOT NULL;
-- ALTER TABLE "Hotels" ALTER COLUMN longitude SET NOT NULL;

-- Create an index for better performance on location-based queries
CREATE INDEX idx_hotels_location ON "Hotels" (latitude, longitude);

-- Optional: Add a check constraint to ensure valid coordinates
ALTER TABLE "Hotels" 
ADD CONSTRAINT chk_valid_coordinates 
CHECK (
    latitude >= -90 AND latitude <= 90 AND 
    longitude >= -180 AND longitude <= 180
);

-- Example query to find hotels within a certain radius (in kilometers)
-- This function calculates distance using the Haversine formula
CREATE OR REPLACE FUNCTION calculate_distance(
    lat1 DECIMAL, lon1 DECIMAL, 
    lat2 DECIMAL, lon2 DECIMAL
) RETURNS DECIMAL AS $$
DECLARE
    R DECIMAL := 6371; -- Earth's radius in kilometers
    dlat DECIMAL;
    dlon DECIMAL;
    a DECIMAL;
    c DECIMAL;
BEGIN
    -- Convert to radians
    dlat := RADIANS(lat2 - lat1);
    dlon := RADIANS(lon2 - lon1);
    lat1 := RADIANS(lat1);
    lat2 := RADIANS(lat2);
    
    -- Haversine formula
    a := SIN(dlat/2) * SIN(dlat/2) + 
         SIN(dlon/2) * SIN(dlon/2) * COS(lat1) * COS(lat2);
    c := 2 * ATAN2(SQRT(a), SQRT(1-a));
    
    RETURN R * c;
END;
$$ LANGUAGE plpgsql;

-- Example usage:
-- Find hotels within 10km of a given location (e.g., Kathmandu center)
-- SELECT name, calculate_distance(27.7172, 85.3240, latitude, longitude) as distance_km
-- FROM "Hotels" 
-- WHERE calculate_distance(27.7172, 85.3240, latitude, longitude) <= 10
-- ORDER BY distance_km;

-- Add comments for documentation
COMMENT ON COLUMN "Hotels".latitude IS 'Latitude coordinate in decimal degrees (WGS84)';
COMMENT ON COLUMN "Hotels".longitude IS 'Longitude coordinate in decimal degrees (WGS84)';
COMMENT ON FUNCTION calculate_distance IS 'Calculate distance between two points using Haversine formula (returns distance in kilometers)'; 