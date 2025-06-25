document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Handle Search Button Click
    const searchButton = document.getElementById('search-button');
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const destination = document.getElementById('destination').value;
            const checkIn = document.getElementById('check-in').value;
            const checkOut = document.getElementById('check-out').value;
            const guests = document.getElementById('guests').value;

            // Basic validation
            if (!destination || !checkIn || !checkOut || !guests) {
                alert('Please fill in all search fields!');
                return;
            }

            // In a real application, you would send this data to a backend
            // for actual hotel search. For this demo, we'll just log it.
            console.log('Search initiated with:');
            console.log('Destination:', destination);
            console.log('Check-in:', checkIn);
            console.log('Check-out:', checkOut);
            console.log('Guests:', guests);

            alert(`Searching for hotels in ${destination} from ${checkIn} to ${checkOut} for ${guests} guests.`);
            // You might redirect to a search results page here:
            // window.location.href = `/search-results.html?dest=${destination}&checkin=${checkIn}&checkout=${checkOut}&guests=${guests}`;
        });
    }

    // Handle "Book Now" Button Clicks
    const bookButtons = document.querySelectorAll('.btn-book');
    bookButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const hotelCard = event.target.closest('.hotel-card');
            if (hotelCard) {
                const hotelName = hotelCard.querySelector('h3').textContent;
                const hotelPrice = hotelCard.querySelector('.price').textContent;
                alert(`You are about to book ${hotelName} for ${hotelPrice}. (This is a demo action)`);
                // In a real app, this would lead to a booking confirmation page or modal.
            }
        });
    });

    // Example of a simple interactive element: changing header background on scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.backgroundColor = '#f8f8f8'; // Slightly change color
            header.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
        } else {
            header.style.backgroundColor = '#fff';
            header.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        }
    });

    // Set minimum date for check-in input to today
    const checkInInput = document.getElementById('check-in');
    if (checkInInput) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        checkInInput.min = `${year}-${month}-${day}`;

        // Ensure check-out date is after check-in date
        checkInInput.addEventListener('change', () => {
            document.getElementById('check-out').min = checkInInput.value;
        });
    }
});