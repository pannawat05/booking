import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import swal from 'sweetalert';
import axios from 'axios';

function Confirm() {
    const { user, price,id } = useParams();
    const [files, setFiles] = useState(null);

    const handleFileChange = (event) => {
        setFiles(event.target.files[0]);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('files', files);

        try {
            const response = await fetch('http://localhost:3001/slipok/', {
                method: 'POST',
                body:formData
            });
         axios.post('http://localhost:3001/update-payment/',
            {
                bookingId:id  
            }
         )

            if (response.ok) {
                const data = await response.json();
               await  swal('Thank you','Slip uploaded successfully!','success');
                console.log('response:', data);
                window.location= await  `/booking/${user}`;
            } else {
                alert('Failed to upload slip, please try again');
            }
        } catch (error) {
            console.log(error);
            alert('An error occurred');
        }
    }

    return (
        <div>
            <br />
            <br />
            <center>
                <h2>You need to pay a room deposit (40% of total): <b className='text-danger'>${price}</b></h2>
                <h4>and the remaining you pay it on the Check-in day</h4>
            </center>

            <h2>Choose your payment method</h2>
            <div className="d-block">
                <div className="d-flex" id='qr' data-bs-toggle="modal" data-bs-target="#exampleModal">
                    <img src="https://www.ceochannels.com/wp-content/uploads/2017/10/PromptPay.jpg" alt="" width={'10%'} /><h3 id="label">QR-Payment</h3>
                </div>
                <div className="d-flex" id='credit'>
                    <img src="https://clipartcraft.com/images/credit-card-logo-merchant-5.png" alt="" width={'10%'} /><h3 id="label">Using Credit/Debit card</h3>
                </div>
            </div>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <center>
                                <h2>Your room deposit: ${price}</h2>
                                <h4>Scan to pay with mobile banking within 5 minutes</h4>
                                <div id="safeTimer">
                                    <h3 id="safeTimerDisplay">05:00</h3>
                                </div>
                                <img src={`https://promptpay.io/0839755619/${price}.png`} alt="QR Code" />
                            </center>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="formFile" className="form-label">Attach your slip</label>
                                    <input className="form-control" type="file" id="formFile" accept='image/*' onChange={handleFileChange} />
                                </div>
                                <button type="submit" className="btn btn-primary">Attach slip</button>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Confirm;
