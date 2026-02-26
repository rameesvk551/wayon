import React from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Help Center',
      links: [
        'Privacy and Cookies Statement',
        'Terms & Conditions',
        'Modern Slavery Statement',
        'Sitemap',
      ],
    },
    {
      title: 'Company',
      links: [
        'About Us',
        'Careers',
        'List your Business',
        'Supplier',
      ],
    },
    {
      title: 'Traveler',
      links: [
        'Booking on Affiliate',
        'Merchant Terms of Sale',
        'Viator Terms of Use',
        'Viator Privacy Policy',
      ],
    },
    {
      title: 'Viator Blog',
      links: [
        'Gift Cards',
        'Traveler Photos',
        'Account',
        'Booking & Support',
      ],
    },
  ];

  const popularCities = [
    'Things to do in Chicago',
    'Things to do in Boston',
    'Things to do in Oahu',
    'Things to do in Miami',
    'Things to do in Las Vegas',
    'Things to do in San Diego',
    'Things to do in San Francisco',
    'Things to do in New Orleans',
    'Things to do in Washington DC',
    'Things to do in Nashville',
    'Things to do in Rome',
    'Things to do in Cancun',
  ];

  const popularAttractions = [
    'Disneyland Tickets',
    'Kennedy Space Center (travel)',
    'National Parks Passes (travel)',
    'Chichen Itza (travel)',
    'Stonehenge (travel)',
    'Hoover Dam (travel)',
    'Colosseum (travel)',
    'Versailles Palace (travel)',
    'Sagrada Familia (travel)',
    'Eiffel Tower (travel)',
    'Leaning Tower of Pisa (travel)',
    'Statue of Liberty (travel)',
  ];

  return (
    <footer className="bg-neutral-900 text-white">
      {/* Trust badges section */}
      <div className="border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col items-center text-center">
            <p className="text-sm text-neutral-400 mb-4">
              A Tripadvisor company
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="bg-primary-600 text-white text-xl font-bold px-3 py-1 rounded">
                  ★★★★★
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold">Excellent</div>
                  <div className="text-xs text-neutral-400">4.5 rating | 346,297 reviews</div>
                  <div className="text-xs text-primary-400 font-semibold mt-1">Verified Ratings</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-bold text-base mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href="#"
                      className="text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-800 my-8"></div>

        {/* Popular cities */}
        <div className="mb-8">
          <h3 className="font-bold text-base mb-4">Popular Cities</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {popularCities.map((city, index) => (
              <a
                key={index}
                href="#"
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                {city}
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-800 my-8"></div>

        {/* Popular attractions */}
        <div className="mb-8">
          <h3 className="font-bold text-base mb-4">Popular Attractions</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {popularAttractions.map((attraction, index) => (
              <a
                key={index}
                href="#"
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                {attraction}
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-800 my-8"></div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <div className="text-sm text-neutral-400">
            © {currentYear} NomadicNook. All rights reserved.
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-5 h-5" />
            </a>
          </div>

          {/* Feedback link */}
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <span>Was this page helpful?</span>
            <button className="text-primary-500 hover:text-primary-400">👍</button>
            <button className="text-accent-500 hover:text-accent-400">👎</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
