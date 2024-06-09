import React, { useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';

function Login() {
  const [username, setUser] = useState('');
  const [password, setPass] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent form submission
    try {
      const response = await axios.get(`http://localhost:3001/login/${username}/${password}`);
      console.log(response.data);
      await swal("success", `${username} logged in`, "success");
       window.location = `/home/${username}`;


    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div>
      <br />
      <h2>Log in</h2>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            onChange={(e) => setUser(e.target.value)}
          />
          <div id="emailHelp" className="form-text">We'll never share your username with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
          <input
            type="text"
            className="form-control"
            id="exampleInputPassword1"
            onChange={(e) => setPass(e.target.value)}
          />
        </div>
        <button type="button" className="btn btn-primary" onClick={handleLogin}>Log in</button>
      
    </div>
  );
}

export default Login;
