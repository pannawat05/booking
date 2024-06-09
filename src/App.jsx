import { useState } from 'react';
import { BrowserRouter, Link, Routes, Route, useParams, useLocation } from 'react-router-dom';
import './App.css';
import Home from './components/home';
import Booking from './components/booking';
import Login from './components/login';
import Confirm from './components/confirm';
import QR from './components/qr';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home/:user" element={<MainApp />} />
        <Route path="/" element={<MainApp />} />
        <Route path="/booking/:user" element={<Booking />} />
        <Route path="/confirm/:user/:price/:id" element={<Confirm />} />
        <Route path="/qr/:user/:price" element={<QR />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

function MainApp() {
  const { user } = useParams();
  const location = useLocation();

  // Extract the user parameter from the URL path
  const currentUser = user || new URLSearchParams(location.search).get('user');

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Booking</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={`/booking/${currentUser}`}>Your Booking</Link>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Travel
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li><a className="dropdown-item" href="#">Action</a></li>
                  <li><a className="dropdown-item" href="#">Another action</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="#">Something else here</a></li>
                </ul>
              </li>
            </ul>
           
              
              <img src="https://static.vecteezy.com/system/resources/previews/000/649/115/original/user-icon-symbol-sign-vector.jpg" alt="" srcset="" id='profile' />
              <div className="nav-item" id='profile'>
              <h5>user:{currentUser}</h5>
              </div>
              
           
              <Link to='/login'><button className="btn btn-outline-warning" type="button">Login</button></Link>
          
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home user={currentUser} />} />
        <Route path="/home/:user" element={<Home user={currentUser} />} />
      </Routes>
    </>
  );
}

export default App;
