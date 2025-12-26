import { useState } from 'react';
import './Booking.css';

function Booking() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingInfo, setBookingInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
  ];

  // Generate seat layout (5 rows x 8 seats)
  const rows = ['A', 'B', 'C', 'D', 'E'];
  const seatsPerRow = 8;
  const [bookedSeats, setBookedSeats] = useState(['A3', 'B5', 'C2', 'D7']); // Example booked seats

  const toggleSeat = (seatId) => {
    if (bookedSeats.includes(seatId)) return; // Can't select booked seats
    
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  const getSeatStatus = (seatId) => {
    if (bookedSeats.includes(seatId)) return 'booked';
    if (selectedSeats.includes(seatId)) return 'selected';
    return 'available';
  };

  const handleBooking = (e) => {
    e.preventDefault();
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }
    if (!selectedDate || !selectedTime) {
      alert('Please select date and time');
      return;
    }
    if (!bookingInfo.name || !bookingInfo.email || !bookingInfo.phone) {
      alert('Please fill in all booking information');
      return;
    }

    alert(`Booking confirmed! Seats: ${selectedSeats.join(', ')} for ${selectedDate} at ${selectedTime}`);
    // Reset form
    setSelectedSeats([]);
    setSelectedDate('');
    setSelectedTime('');
    setBookingInfo({ name: '', email: '', phone: '' });
  };

  const totalPrice = selectedSeats.length * 15; // $15 per seat per hour

  return (
    <div className="booking">
      <div className="booking-header">
        <h1>Book Your Gaming Seat</h1>
        <p>Reserve your spot and enjoy premium gaming experience</p>
      </div>

      <div className="booking-container">
        <div className="booking-main">
          <div className="booking-form-section">
            <h2>Select Date & Time</h2>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="form-group">
              <label>Time Slot</label>
              <div className="time-slots">
                {timeSlots.map(time => (
                  <button
                    key={time}
                    type="button"
                    className={selectedTime === time ? 'time-slot active' : 'time-slot'}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="seat-selection-section">
            <h2>Select Your Seats</h2>
            <div className="seat-legend">
              <div className="legend-item">
                <div className="seat available"></div>
                <span>Available</span>
              </div>
              <div className="legend-item">
                <div className="seat selected"></div>
                <span>Selected</span>
              </div>
              <div className="legend-item">
                <div className="seat booked"></div>
                <span>Booked</span>
              </div>
            </div>
            <div className="screen">Screen</div>
            <div className="seats-layout">
              {rows.map(row => (
                <div key={row} className="seat-row">
                  <div className="row-label">{row}</div>
                  {Array.from({ length: seatsPerRow }, (_, i) => {
                    const seatId = `${row}${i + 1}`;
                    const status = getSeatStatus(seatId);
                    return (
                      <button
                        key={seatId}
                        className={`seat ${status}`}
                        onClick={() => toggleSeat(seatId)}
                        disabled={status === 'booked'}
                        title={seatId}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="booking-info-section">
            <h2>Your Information</h2>
            <form onSubmit={handleBooking}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={bookingInfo.name}
                  onChange={(e) => setBookingInfo({...bookingInfo, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={bookingInfo.email}
                  onChange={(e) => setBookingInfo({...bookingInfo, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={bookingInfo.phone}
                  onChange={(e) => setBookingInfo({...bookingInfo, phone: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="book-btn">
                Confirm Booking
              </button>
            </form>
          </div>
        </div>

        <div className="booking-summary">
          <h2>Booking Summary</h2>
          <div className="summary-content">
            <div className="summary-item">
              <span>Date:</span>
              <span>{selectedDate || 'Not selected'}</span>
            </div>
            <div className="summary-item">
              <span>Time:</span>
              <span>{selectedTime || 'Not selected'}</span>
            </div>
            <div className="summary-item">
              <span>Seats:</span>
              <span>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None selected'}</span>
            </div>
            <div className="summary-item">
              <span>Duration:</span>
              <span>1 hour</span>
            </div>
            <div className="summary-item">
              <span>Price per seat:</span>
              <span>$15.00</span>
            </div>
            <div className="summary-total">
              <span>Total:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;

