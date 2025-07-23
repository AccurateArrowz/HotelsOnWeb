# City Features Implementation

## Overview
This implementation adds city-specific hotel browsing functionality to the HotelsOnWeb application.

## New Features

### 1. City Cards Section on Home Page
- Added a "Popular Destinations" section with city cards
- Each card shows city name, image, and hotel count
- Clicking a city card navigates to `/cityname` route

### 2. City-Specific Hotel Pages
- New route: `/:cityName` (e.g., `/kathmandu`, `/pokhara`)
- Displays hotels filtered by city
- Shows loading states and error handling
- Responsive design with modern UI

### 3. Backend API Endpoint
- New endpoint: `GET /api/hotels/city/:cityName`
- Case-insensitive city search
- Returns hotels filtered by city name
- Includes proper error handling

## Files Created/Modified

### Frontend
- `frontend/src/components/CityCard.jsx` - City card component
- `frontend/src/pages/CityHotels.jsx` - City-specific hotel page
- `frontend/src/pages/CityHotels.css` - Styles for city hotels page
- `frontend/src/pages/Home.jsx` - Added city cards section
- `frontend/src/pages/Home.css` - Added city cards styles
- `frontend/src/App.jsx` - Added city route
- `frontend/src/components/HotelList.jsx` - Updated to accept props
- `frontend/src/components/HotelCard.jsx` - Updated for backend data

### Backend
- `backend/src/routes/hotels.js` - Hotel API routes
- `backend/server.js` - Added hotel routes middleware

## Testing the Features

### 1. Start the Backend
```bash
cd backend
npm install
npm start
```

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Test City Features
1. Visit the home page - you should see the "Popular Destinations" section
2. Click on any city card (e.g., Kathmandu)
3. You should be redirected to `/kathmandu` and see hotels from that city
4. Test with different cities: `/pokhara`, `/chitwan`, etc.

### 4. Test API Endpoints
```bash
# Get all hotels
curl http://localhost:5000/api/hotels

# Get hotels by city
curl http://localhost:5000/api/hotels/city/kathmandu
curl http://localhost:5000/api/hotels/city/pokhara
```

## Available Cities
Based on the seed data, these cities have hotels:
- Kathmandu (4 hotels)
- Solukhumbu (1 hotel - Everest Summit Lodge)
- Pokhara (1 hotel - Annapurna Lakeside Resort)
- Chitwan (1 hotel - Wildlife Sanctuary Lodge)

## Notes
- The city route `/:cityName` is placed after other specific routes to avoid conflicts
- Hotel data comes from the backend API, not mock data
- City images are from Unsplash (you may want to replace with actual city photos)
- Hotel counts in city cards are hardcoded for now (can be made dynamic later) 