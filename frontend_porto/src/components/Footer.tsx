// src/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Mwananchi Communications LTD</h3>
          <p>Plot no: 34/35 Mandela Road,</p>
          <p>Tabata Relini, Mwananchi,</p>
          <p>Dar es Salaam, Tanzania</p>
          <p className="mt-2">Phone: +255 754 780 647</p>
          <p>Email: <a href="mailto:support@mwananchi.co.tz" className="hover:underline">support@mwananchi.co.tz</a></p>
          <p>Advertising: <a href="mailto:jtarimo@tz.nationmedia.com" className="hover:underline">jtarimo@tz.nationmedia.com</a></p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Our Address</h3>
          <p>Plot no: 34/35 Mandela Road,</p>
          <p>Tabata Relini, Mwananchi,</p>
          <p>Dar es Salaam, Tanzania</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <p>Email Us:</p>
          <p><a href="mailto:support@mwananchi.co.tz" className="hover:underline">support@mwananchi.co.tz</a></p>
          <p>Advertising: <a href="mailto:jtarimo@tz.nationmedia.com" className="hover:underline">jtarimo@tz.nationmedia.com</a></p>
          <p className="mt-2">Call Us:</p>
          <p>+255 754 780 647</p>
        </div>
      </div>
      <div className="text-center mt-6 border-t border-gray-700 pt-4">
        <p>© {new Date().getFullYear()} Mwananchi Communications LTD. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;