import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to GameZone Lounge</h1>
          <p className="hero-subtitle">
            Your Ultimate Gaming Destination
          </p>
          <p className="hero-description">
            Experience premium gaming with state-of-the-art equipment, 
            comfortable seating, and an unbeatable atmosphere. 
            Join tournaments, book your seat, and shop the latest gaming gear.
          </p>
          <div className="hero-buttons">
            <Link to="/booking" className="btn btn-primary">
              Book a Seat Now
            </Link>
            <Link to="/shop" className="btn btn-secondary">
              Explore Shop
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="gaming-setup">🎮</div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose GameZone?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💻</div>
              <h3>Premium Equipment</h3>
              <p>Top-of-the-line gaming PCs, consoles, and peripherals</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Tournaments</h3>
              <p>Compete in regular tournaments and win amazing prizes</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Comfortable Seating</h3>
              <p>Ergonomic chairs and spacious gaming stations</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛒</div>
              <h3>Gaming Store</h3>
              <p>Shop the latest games, accessories, and merchandise</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to Level Up?</h2>
          <p>Join our community and experience gaming like never before</p>
          <Link to="/events" className="btn btn-primary">
            View Upcoming Events
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;

