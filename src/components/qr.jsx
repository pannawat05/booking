import React from 'react'
import { useState } from 'react';
import { BrowserRouter, Link, Routes, Route, useParams, useLocation } from 'react-router-dom';

function qr() {
    const {user,price} = useParams();
  return (
    <div>
        <br />
        <br />
        <center>
        <h2>your room deposit:${price}</h2>
        <h4>scan to pay with mobile banking with in 5 minutes</h4>
        <div id="safeTimer">
<h3 id="safeTimerDisplay">05:00</h3>
</div>
        <img src={`https://promptpay.io/0839755619/${price}.png`}></img>
        </center>
    </div>
  )
}

export default qr