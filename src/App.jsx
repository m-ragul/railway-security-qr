import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Navbar from './Navbar';
import Login from './Login';
import Register from './Register';
import PassengerForm from './PassengerForm';
import QrScannerComponent from './QrScanner';
import styles from './App.module.css'; // Import CSS module for styling

const App = () => {
  const [scannedData, setScannedData] = useState(null);

  const handleScan = (data) => {
    setScannedData(data);
  };

  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <>
                  <PassengerForm />
                  <div className="qr-scanner-wrapper">
                  <QrScannerComponent onScan={handleScan} />
                  </div>
                  {scannedData && (
                    <div className={styles.scannedDataContainer}>
                      <h3 className={styles.scannedDataHeading}>Scanned Ticket Data</h3>
                      <p className={styles.scannedDataText}>
                        <strong>Passenger Name:</strong> {scannedData.passengerName}
                      </p>
                      <p className={styles.scannedDataText}>
                        <strong>Departure Station:</strong> {scannedData.departureStation}
                      </p>
                      <p className={styles.scannedDataText}>
                        <strong>Arrival Station:</strong> {scannedData.arrivalStation}
                      </p>
                      <p className={styles.scannedDataText}>
                        <strong>PNR:</strong> {scannedData.pnr}
                      </p>
                    </div>
                  )}
                </>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Login />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
