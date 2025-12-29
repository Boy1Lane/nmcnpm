import React from 'react';

const Footer = () => (
  <footer style={{ padding: '40px 5%', background: '#111', color: '#888', borderTop: '1px solid #333', textAlign: 'center' }}>
    <p>&copy; {new Date().getFullYear()} CinemaVerse. Hệ thống đặt vé trực tuyến.</p>
  </footer>
);
export default Footer;