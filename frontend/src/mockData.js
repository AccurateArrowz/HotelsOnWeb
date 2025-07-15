export const hotels = [
  {
    id: 1,
    name: 'Grand Palace Hotel',
    location: 'New York, NY',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    price: 180,
    rating: 4.5,
    rooms: [
      { type: 'Single', price: 120, available: 5 },
      { type: 'Double', price: 180, available: 3 },
      { type: 'Suite', price: 300, available: 2 },
    ],
    description: 'A luxury hotel in the heart of New York City.'
  },
  {
    id: 2,
    name: 'Seaside Resort',
    location: 'Miami, FL',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
    price: 150,
    rating: 4.2,
    rooms: [
      { type: 'Single', price: 100, available: 8 },
      { type: 'Double', price: 150, available: 5 },
      { type: 'Suite', price: 250, available: 1 },
    ],
    description: 'Relax by the beach at our beautiful seaside resort.'
  },
  {
    id: 3,
    name: 'Mountain View Inn',
    location: 'Denver, CO',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80',
    price: 110,
    rating: 4.0,
    rooms: [
      { type: 'Single', price: 80, available: 10 },
      { type: 'Double', price: 110, available: 6 },
      { type: 'Suite', price: 200, available: 2 },
    ],
    description: 'Enjoy the mountain views and fresh air.'
  }
];

export const users = [
  { id: 1, name: 'Alice', role: 'guest', email: 'alice@example.com' },
  { id: 2, name: 'Bob', role: 'hotelOwner', email: 'bob@example.com' },
  { id: 3, name: 'Carol', role: 'admin', email: 'carol@example.com' },
]; 