import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Navigation.css';

function Navigation() {
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);

  // Get cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    };
    
    updateCartCount();
    // Listen for custom cart update event
    window.addEventListener('cartUpdated', updateCartCount);
    // Also listen for storage changes (cross-tab updates)
    window.addEventListener('storage', updateCartCount);
    
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🎮</span>
          <span className="logo-text">GameZone Lounge</span>
        </Link>
        
        <ul className="nav-menu">
          <li>
            <Link 
              to="/" 
              className={isActive('/') ? 'nav-link active' : 'nav-link'}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/shop" 
              className={isActive('/shop') ? 'nav-link active' : 'nav-link'}
            >
              Shop
            </Link>
          </li>
          <li>
            <Link 
              to="/booking" 
              className={isActive('/booking') ? 'nav-link active' : 'nav-link'}
            >
              Book Seat
            </Link>
          </li>
          <li>
            <Link 
              to="/events" 
              className={isActive('/events') ? 'nav-link active' : 'nav-link'}
            >
              Events
            </Link>
          </li>
        </ul>

        <div className="nav-cart">
          <Link to="/shop" className="cart-icon">
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;

