import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import './PassengerForm.css';

function PassengerForm() {
    const [formData, setFormData] = useState({
        passengerName: '',
        departureStation: '',
        arrivalStation: '',
    });

    const [submittedData, setSubmittedData] = useState(null);
    const [errors, setErrors] = useState({
        passengerName: '',
        departureStation: '',
        arrivalStation: '',
    });

    const [apiError, setApiError] = useState(null);

    const generatePNR = () => {
        return Math.floor(1000000000 + Math.random() * 9000000000).toString();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({ passengerName: '', departureStation: '', arrivalStation: '' });
        setApiError(null);

        let newErrors = {};

        if (!formData.passengerName) {
            newErrors.passengerName = 'Passenger name is required.';
        } else if (!formData.departureStation) {
            newErrors.departureStation = 'Departure station is required.';
        } else if (!formData.arrivalStation) {
            newErrors.arrivalStation = 'Arrival station is required.';
        } else if (formData.departureStation === formData.arrivalStation) {
            newErrors.arrivalStation = 'Arrival station cannot be the same as departure station.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const pnr = generatePNR();
        const qrCode = JSON.stringify({ ...formData, pnr });
        const bookingData = { ...formData, pnr, qrCode };

        try {
            const response = await fetch('http://localhost:5000/book-ticket', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData),
            });

            const result = await response.json();

            if (response.ok) {
                setSubmittedData(bookingData);
                //alert(result.message);
                //Clear the textboxes 
                setFormData({ passengerName: '', 
                              departureStation: '', 
                              arrivalStation: '' 
                            });
            } else {
                setApiError(result.error || 'Failed to book ticket');
            }
        } catch (error) {
            console.error('Error:', error);
            setApiError('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="background">
            <div className="form-container passengerForm">
                <h2>Passenger Form</h2>
                <form onSubmit={handleSubmit}>
                    <div className="inputGroup">
                        <label>Passenger Name:</label>
                        <input
                            type="text"
                            name="passengerName"
                            value={formData.passengerName}
                            onChange={handleChange}
                        />
                        {errors.passengerName && <p className="errorMessage">{errors.passengerName}</p>}
                    </div>
                    <div className="inputGroup">
                        <label>Departure Station:</label>
                        <input
                            type="text"
                            name="departureStation"
                            value={formData.departureStation}
                            onChange={handleChange}
                        />
                        {errors.departureStation && <p className="errorMessage">{errors.departureStation}</p>}
                    </div>
                    <div className="inputGroup">
                        <label>Arrival Station:</label>
                        <input
                            type="text"
                            name="arrivalStation"
                            value={formData.arrivalStation}
                            onChange={handleChange}
                        />
                        {errors.arrivalStation && <p className="errorMessage">{errors.arrivalStation}</p>}
                    </div>
                    <button type="submit" className="submitBtn">Submit</button>
                </form>

                {apiError && <p className="errorMessage">Error: {apiError}</p>}

                {submittedData && (
                    <div className="submitted-data-container">
                        <h3>Passenger Data</h3>
                        <p>Passenger Name: {submittedData.passengerName}</p>
                        <p>Departure Station: {submittedData.departureStation}</p>
                        <p>Arrival Station: {submittedData.arrivalStation}</p>
                        <p>PNR: {submittedData.pnr}</p>

                        <div>
                            <h4>QR Code:</h4>
                            <div className="qr-code-wrapper">
                                <QRCode value={JSON.stringify(submittedData)} />
                            </div>
                        </div>
                    </div>
                    
                )}
            </div>
            <br />
            <br />
            <br />
        </div>
    );
}

export default PassengerForm;
