import React from 'react';
import './Footer.css';

const Footer = () => {
  const imageAttributions = [
    {
      city: 'Bhaktapur',
      photographer: 'Suraj Shakya',
      url: 'https://unsplash.com/photos/person-in-red-and-yellow-floral-headdress-holding-black-and-red-stick-bHwQAc9ecsc?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash'
    },
    {
      city: 'Ilam',
      photographer: 'Sashi Shrestha',
      url: 'https://unsplash.com/photos/white-car-on-road-near-green-mountains-during-daytime-_5-GEPZoza4?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash'
    },
    {
      city: 'Chitwan',
      photographer: 'Vince Russell',
      url: 'https://unsplash.com/photos/two-person-riding-elephant-FXVY6ZIOkhM?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash'
    },
    {
      city: 'Pokhara',
      photographer: 'titas gurung',
      url: 'https://unsplash.com/photos/assorted-color-boat-on-the-body-of-water-ntBPI4OnXZ0?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash'
    },
    {
      city: 'Kathmandu',
      photographer: 'Raimond Klavins',
      url: 'https://unsplash.com/photos/a-view-of-a-city-with-mountains-in-the-background-n0RIwkDfJ1g?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash'
    },
    {
      city: 'Lumbini',
      photographer: 'ashok acharya',
      url: 'https://unsplash.com/photos/white-concrete-building-under-blue-sky-during-daytime-aNU8MnzWhKo?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash'
    }
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Main Footer Content */}
          <div className="footer-main">
            <h3 className="footer-title">HotelsOnWeb</h3>
            <p className="footer-description">
              Discover the best hotels across Nepal's most beautiful destinations. 
              From the bustling streets of Kathmandu to the serene lakes of Pokhara, 
              find your perfect stay with us.
            </p>
            <div className="footer-links">
              <a href="#" className="footer-link">
                About Us
              </a>
              <a href="#" className="footer-link">
                Contact
              </a>
              <a href="#" className="footer-link">
                Privacy Policy
              </a>
              <a href="#" className="footer-link">
                Terms of Service
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-destinations">
            <h4 className="footer-section-title">Popular Destinations</h4>
            <ul className="footer-destinations-list">
              <li>
                <a href="/hotels/kathmandu" className="footer-link">
                  Kathmandu
                </a>
              </li>
              <li>
                <a href="/hotels/pokhara" className="footer-link">
                  Pokhara
                </a>
              </li>
              <li>
                <a href="/hotels/chitwan" className="footer-link">
                  Chitwan
                </a>
              </li>
              <li>
                <a href="/hotels/bhaktapur" className="footer-link">
                  Bhaktapur
                </a>
              </li>
              <li>
                <a href="/hotels/ilam" className="footer-link">
                  Ilam
                </a>
              </li>
              <li>
                <a href="/hotels/lumbini" className="footer-link">
                  Lumbini
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Image Attributions */}
        <div className="footer-attributions">
          <h4 className="footer-section-title">Photo Credits</h4>
          <p className="footer-attribution-note">
            All city images are sourced from Unsplash and are free to use under the Unsplash License.
          </p>
          <div className="attributions-grid">
            {imageAttributions.map((attribution, index) => (
              <div key={index} className="attribution-item">
                <span className="attribution-city">{attribution.city}: </span>
                <a 
                  href={attribution.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="attribution-link"
                >
                  Photo by {attribution.photographer} on Unsplash
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-copyright">
          <p className="copyright-text">
            © {new Date().getFullYear()} HotelsOnWeb. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 