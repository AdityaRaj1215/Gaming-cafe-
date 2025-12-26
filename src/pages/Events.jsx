import { useState } from 'react';
import './Events.css';

function Events() {
  const [events] = useState([
    {
      id: 1,
      title: 'Fortnite Championship',
      date: '2024-03-15',
      time: '06:00 PM',
      type: 'Tournament',
      image: '🎯',
      description: 'Join our biggest Fortnite tournament with $5000 prize pool. Solo and duo competitions available.',
      prize: '$5,000',
      participants: 64,
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Valorant Pro League',
      date: '2024-03-20',
      time: '07:00 PM',
      type: 'Tournament',
      image: '🔫',
      description: 'Competitive Valorant tournament featuring best teams. Watch live or participate!',
      prize: '$3,000',
      participants: 32,
      status: 'upcoming'
    },
    {
      id: 3,
      title: 'Gaming Night Social',
      date: '2024-03-10',
      time: '08:00 PM',
      type: 'Social',
      image: '🎮',
      description: 'Casual gaming night with friends. Free play, snacks, and drinks included.',
      prize: 'Free Entry',
      participants: 50,
      status: 'upcoming'
    },
    {
      id: 4,
      title: 'CS2 Championship',
      date: '2024-03-25',
      time: '05:00 PM',
      type: 'Tournament',
      image: '💣',
      description: 'Counter-Strike 2 tournament with professional teams. Spectator tickets available.',
      prize: '$7,500',
      participants: 16,
      status: 'upcoming'
    },
    {
      id: 5,
      title: 'Rocket League Cup',
      date: '2024-03-18',
      time: '04:00 PM',
      type: 'Tournament',
      image: '⚽',
      description: 'Fast-paced Rocket League competition. Teams of 3 required.',
      prize: '$2,000',
      participants: 24,
      status: 'upcoming'
    },
    {
      id: 6,
      title: 'Retro Gaming Night',
      date: '2024-03-12',
      time: '06:00 PM',
      type: 'Social',
      image: '🕹️',
      description: 'Nostalgic night with classic games. Mario Kart, Street Fighter, and more!',
      prize: 'Free Entry',
      participants: 40,
      status: 'upcoming'
    }
  ]);

  const [filter, setFilter] = useState('All');

  const eventTypes = ['All', 'Tournament', 'Social'];
  const filteredEvents = filter === 'All' 
    ? events 
    : events.filter(e => e.type === filter);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleRegister = (eventId) => {
    alert(`Registration for event ${eventId} would open here!`);
  };

  return (
    <div className="events">
      <div className="events-header">
        <h1>Upcoming Events</h1>
        <p>Join tournaments, social gaming nights, and more exciting events</p>
      </div>

      <div className="events-container">
        <div className="events-filter">
          {eventTypes.map(type => (
            <button
              key={type}
              className={filter === type ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setFilter(type)}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="events-grid">
          {filteredEvents.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-image">{event.image}</div>
              <div className="event-badge">{event.type}</div>
              <div className="event-content">
                <h2>{event.title}</h2>
                <div className="event-date-time">
                  <span className="event-date">📅 {formatDate(event.date)}</span>
                  <span className="event-time">🕐 {event.time}</span>
                </div>
                <p className="event-description">{event.description}</p>
                <div className="event-details">
                  <div className="event-detail-item">
                    <span className="detail-label">Prize Pool:</span>
                    <span className="detail-value">{event.prize}</span>
                  </div>
                  <div className="event-detail-item">
                    <span className="detail-label">Participants:</span>
                    <span className="detail-value">{event.participants}</span>
                  </div>
                </div>
                <button 
                  className="register-btn"
                  onClick={() => handleRegister(event.id)}
                >
                  Register Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="events-cta">
        <h2>Want to Host Your Own Event?</h2>
        <p>Contact us to organize tournaments, LAN parties, or gaming meetups</p>
        <button className="contact-btn">Contact Us</button>
      </div>
    </div>
  );
}

export default Events;

