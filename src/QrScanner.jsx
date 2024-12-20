import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner'; // Import the QR Scanner package
import styles from './QrScanner.module.css'; // Import CSS module for styling

const QrScannerComponent = ({ onScan }) => {
    const [data, setData] = useState('No result');
    const [validationMessage, setValidationMessage] = useState('');

    const handleScan = async (scannedData) => {
        if (scannedData) {
            try {
                const rawText = scannedData.text || scannedData;
                const parsedData = JSON.parse(rawText);
                console.log("Scanned Data:", parsedData);

                if (parsedData.qrCode) {
                    parsedData.qrCode = JSON.parse(parsedData.qrCode);
                }

                setData(parsedData);
                onScan(parsedData);

                const response = await fetch('http://localhost:5000/validate-ticket', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pnr: parsedData.pnr }),
                });

                const result = await response.json();
                if (response.ok) {
                    setValidationMessage(`✅ Ticket is valid. Passenger: ${result.ticket.passenger_name}`);
                } else {
                    setValidationMessage(`❌ ${result.message || 'Ticket is invalid.'}`);
                }
            } catch (error) {
                console.error("Invalid QR Code data", error);
                setValidationMessage('❌ Invalid QR Code. Please try again.');
            }
        }
    };

    const handleError = (err) => {
        console.error(err);
    };

    return (
        <>
        <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br />
        <div className={styles.scannerContainer}>
            <h2 className={styles.scannerHeading}>QR Code Scanner</h2>
            <QrScanner
                delay={300}
                onError={handleError}
                onScan={handleScan}
                style={{ width: '100%' }}
            />
            <div className="qr-scanner-wrapper">
            <p className={styles.validationMessage}>{validationMessage}</p>
            </div>
        </div>
        </>
    );
};

export default QrScannerComponent;
