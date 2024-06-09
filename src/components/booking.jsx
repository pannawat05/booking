import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Booking() {
  const [bookings, setBookings] = useState([]);
  const { user } = useParams();
  const [selectedBookingId, setSelectedBookingId] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/my/${user}`);
        console.log('Fetched bookings:', response.data); // Log the data
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, [user]);

  // Calculate the total price
  const totalPrice = bookings.reduce((total, booking) => {
    console.log('Processing booking:', booking);
    const price = parseFloat(booking.hotelDetails.price);
    console.log(`Parsed price for booking ID ${booking._id}:`, price);
    if (!isNaN(price)) {
      return total + price;
    } else {
      console.warn(`Invalid price for booking ID ${booking._id}:`, booking.hotelDetails.price);
      return total;
    }
  }, 0);

  const handleSelectChange = (event, bookingId) => {
    setSelectedBookingId(bookingId);
  };


  const handelCancel = (id) =>{
    
    axios.delete(`http://localhost:3001/delete/${id}`);
  window.location = `/home/${user}`;

  }

  return (
    <div>
      <h2>Your Bookings</h2>
      {bookings.length > 0 ? (
        <div>
          <table className="table table-responsive">
            <thead className="table-success">
              <tr>
                <th scope="col">Image</th>
                <th scope="col">Name</th>
                <th scope="col">Check-In</th>
                <th scope="col">Check-Out</th>
                <th scope="col">Price</th>
                <th scope="col">Person/Room</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td width="20%">
                    <img src={booking.hotelDetails.image} alt="Hotel" width="60%" />
                  </td>
                  <td>{booking.hotelDetails.name}</td>
                  <td>{booking.checkIn}</td>
                  <td>{booking.checkOut}</td>
                  <td>${booking.hotelDetails.price}</td>
                  <td>
                    <select 
                      className="form-select" 
                      aria-label="Default select example" 
                      onChange={(e) => handleSelectChange(e, booking._id)}
                    >
                      <option value="" disabled>Confirm your person and room</option>
                      <option value="1">1 Adult, 0 Children, 1 Room</option>
                      <option value="2">2 Adults, 0 Children, 1 Room</option>
                      <option value="2">1 Adult, 1 Child, 1 Room</option>
                      <option value="3">2 Adults, 1 Child, 1 Room</option>
                    </select>
                    <input 
                      type="hidden" 
                      name="bookingId" 
                      value={selectedBookingId} 
                      onChange={(e) => setSelectedBookingId(e.target.value)} 
                    />
                  </td>
                  <td>
                    {booking.payment === false ? (
                      <p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" className="bi bi-clock-history" viewBox="0 0 16 16">
                          <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976q.576.129 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69q.406.429.747.91zm.744 1.352a7 7 0 0 0-.214-.468l.893-.45a8 8 0 0 1 .45 1.088l-.95.313a7 7 0 0 0-.179-.483m.53 2.507a7 7 0 0 0-.1-1.025l.985-.17q.1.58.116 1.17zm-.131 1.538q.05-.254.081-.51l.993.123a8 8 0 0 1-.23 1.155l-.964-.267q.069-.247.12-.501m-.952 2.379q.276-.436.486-.908l.914.405q-.24.54-.555 1.038zm-.964 1.205q.183-.183.35-.378l.758.653a8 8 0 0 1-.401.432z"/>
                          <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z"/>
                          <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5"/>
                        </svg>
                        deposit waiting
                      </p>
                    ) : (
                      <p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" className="bi bi-check2-all" viewBox="0 0 16 16">
                          <path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0"/>
                          <path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708"/>
                        </svg>
                        success
                      </p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='d-flex justify-content-center'>
            <h3 className='d-flex'>Total Price: ${totalPrice.toFixed(2)}</h3> 
            <h3 className='d-flex l' style={{ marginLeft: '30px' }}>Room deposit (40% of total price): ${(totalPrice * 0.4).toFixed(2)}</h3>
          </div>
        </div>
      ) : (
        <p>No bookings found.</p>
      )}
      <div className="d-flex justify-content-between">
        <div className="d-flex">
        <a href={`/home/${user}`}><button className="btn btn-primary">Back to Home</button></a>
       <button className="btn btn-warning ms-3" onClick={handelCancel(selectedBookingId)}>cancel booking</button>
       </div>
        <a href={`/confirm/${user}/${(totalPrice * 0.4).toFixed(2)}/${selectedBookingId}`}><button className="btn btn-success d-flex me-3">Confirm</button></a>
      </div>
    </div>
  );
}

export default Booking;
