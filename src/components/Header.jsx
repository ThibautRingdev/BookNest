import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'


const buttonStyle = {
  padding: '8px 20px',
  fontSize: '1rem',
  backgroundColor: '#fff',
  color: '#000',                
  border: '1px solid #000',     
  borderRadius: '4px',
  cursor: 'pointer',
  transition: 'background-color 0.2s, color 0.2s',
};

const links = [
  { label: "Tableau de bord", path: '/' },
  { label: "Livres", path: '/books' },
  { label: "Emprunts", path: '/Loan' }
];

function Header() {
  const [hoveredIndex, setHoveredIndex] = React.useState(null);

  const getButtonStyle = idx => {
    if (hoveredIndex === idx) {
      return {
        ...buttonStyle,
        backgroundColor: '#000',  
        color: '#fff',            
      };
    }
    return buttonStyle;
  }

  const buttons = [
    'Tableau de bord',
    'Livres',
    'Emprunts',
  ];

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 32px',
      backgroundColor: '#fff',
      borderBottom: '1px solid #ddd'
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
        Logo BookNest
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        {links.map((link, idx) => (
          <Link
            key={link.path}
            to={link.path}
            style={{ textDecoration: 'none' }}
          >
            <button
              style={getButtonStyle(idx)}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {link.label}
            </button>
          </Link>
        ))}
      </div>
    </header>
  );
};

export default Header;