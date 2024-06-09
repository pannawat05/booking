import React, { useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import swal from 'sweetalert';

function Home() {
  const [place, setPlace] = useState('');
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [people, setPeople] = useState('');
  const { user } = useParams();
  const [hotels, setHotels] = useState([]);
  const [book, setBook] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/search/${place}/${checkIn}/${checkOut}/${people}`);
      console.log(response.data);
      setHotels(response.data);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const booking = async (id) => {
    const willBook = await swal({
      title: "Are you sure?",
      text: "Once you book your selected hotel, you need to pay a confirmation fee first.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (willBook) {
      try {
        const response = await axios.post('http://localhost:3001/booking/', {
          checkIn: checkIn,
          checkOut: checkOut,
          user: user,
          hotel: id
        });

        console.log(response.data);
        await swal("Success", "Your booking has been confirmed", "success");
        window.location = `/booking/${user}`;
      } catch (error) {
        console.error('Error booking:', error);
      }
    } else {
      swal("Your booking is cancelled.");
    }
  };

  return (
    <div>
      <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="https://thumbs.dreamstime.com/b/unseen-phuket-thailand-66985796.jpg" className="d-block w-100" height={'280px'} alt="..." />
          </div>
          <div className="carousel-item">
            <img src="https://tse2.mm.bing.net/th?id=OIP.h4i0vKQgUshYmNM-5VabaAHaE7&pid=Api&P=0&h=180" className="d-block w-100" height={'280px'} alt="..." />
          </div>
          <div className="carousel-item">
            <img src="https://tse3.mm.bing.net/th?id=OIP.P5ldtqVoFBj2ZGbflcjvbQHaE8&pid=Api&P=0&h=180" className="d-block w-100" height={'280px'} alt="..." />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      <div className="d-flex" id="scope">
        <select
          className="w-25 icon2 d"
          aria-label="Default select example"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
        >
          <option value="" selected disabled>Where are you going</option>
          <option value="Olongapo">Olongapo</option>
          <option value="Pagadian">Pagadian</option>
          <option value="Carcar">Carcar</option>
          <option value="General Trias">General Trias</option>
          <option value="Koronadal">Koronadal</option>
          <option value="Bacolod">Bacolod</option>
          <option value="Cauayan">Cauayan</option>
          <option value="Cotabato City">Cotabato City</option>
          <option value="Canlaon">Canlaon</option>
          <option value="Kidapawan">Kidapawan</option>
        </select>
        <p>&nbsp;&nbsp;</p>
        <input
          type="date"
          className="form-control w-25 icon"
          name="date"
          id="date"
          placeholder="Check-in"
          value={checkIn || ''}
          onChange={(e) => setCheckIn(e.target.value)}
        />
        <p>&nbsp;&nbsp;</p>
        <input
          type="date"
          className="form-control w-25 icon"
          name="check-out"
          id="check-out"
          placeholder="Check-out"
          value={checkOut || ''}
          onChange={(e) => setCheckOut(e.target.value)}
        />
        <p>&nbsp;&nbsp;</p>
        <select
          className="w-25 icon3 d"
          aria-label="Default select example"
          value={people}
          onChange={(e) => setPeople(e.target.value)}
        >
          <option value="" selected disabled>People</option>
          <option value="1">1 Adult, 0 Children, 1 Room</option>
          <option value="2">2 Adults, 0 Children, 1 Room</option>
          <option value="2">1 Adult, 1 Child, 1 Room</option>
          <option value="3">2 Adults, 1 Child, 1 Room</option>
        </select>
        <p>&nbsp;&nbsp;</p>
        <button type="button" className="btn btn-primary w-25" onClick={handleSearch}>
          Search
        </button>
      </div>
      <br />
      <div className="row">
        <div className="col col-sm-4 md-2">
          Filter
        </div>
        <div className="col col-md">
          {hotels.length > 0 ? (
            hotels.map((hotel, index) => (
              <div key={index}>
                <input type="hidden" name="" value={hotel._id} onChange={(e) => setBook(e.target.value)} />
                <center>
                  <div className="d-flex">
                    <img src={hotel.image} alt="" srcSet="" width={'150px'} height={'100px'} />
                    <h3 style={{ fontSize: '20px' }}>{hotel.name}</h3>
                    <img src="https://tse3.mm.bing.net/th?id=OIP.DwlpMS2oEFrIZ20E9XDSogHaEC&pid=Api&P=0&h=180" alt="" srcSet="" width={'5%'} height={'2%'} />
                    <h5>{hotel.star} Stars</h5>
                    <div className="d-block"><br /><br />
                      <div className="d-flex">
                        <i className="fa-solid fa-coins d-flex">Price: ${hotel.price}</i>
                        <button className="btn btn-warning mt-5 me-5" onClick={() => booking(hotel._id)}>
                          <i className="fa-regular fa-calendar-check">Booking</i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex">
                    <h6><i className="fa-solid fa-phone"></i>{hotel.phone}</h6>
                    <p>&nbsp;</p>
                    <h6><i className="fa-solid fa-location-dot"></i>{hotel.city}</h6>
                  </div>
                </center>
              </div>
            ))
          ) : (
            <h3>No records</h3>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
