import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useParams } from 'react-router-dom';  // Import useParams
import './QRScanner.css';
QrScanner.WORKER_PATH = '/qr-scanner-worker.min.js';

const Attendance = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const videoRef = useRef(null);
    const [qrScanner, setQrScanner] = useState(null);
    const [animal, setAnimal] = useState(null);
    const { animalId } = useParams();
    const [showPopup, setShowPopup] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (videoRef.current) {
            const scanner = new QrScanner(videoRef.current, (result) => {
                console.log(result);
                //fetchAnimalDetails(result);
                scanner.stop();
            }, (error) => {
                console.error(error);
                setError('Failed to scan QR code');
            });

            setQrScanner(scanner);

            scanner.start().catch(err => {
                console.error(err);
                setError('Unable to access the camera.');
            });

            return () => scanner.destroy();
        }
    }, []);

    // const fetchAnimalDetails = (animalId) => {
    //     axios.get(`${baseUrl}animal/${animalId}`)
    //         .then(response => {
    //             setAnimal(response.data);
    //             setShowPopup(true);
    //         })
    //         .catch(error => {
    //             console.error('Error fetching animal details:', error);
    //             setError('Animal not found or server error');
    //             setShowPopup(true);
    //         });
    // };

    const handleClose = () => {
        setShowPopup(false);
        qrScanner.start().catch(err => console.error('Error restarting scanner:', err)); // Restart scanning
    };

    


    return (
        <div className="qr-scanner-container">
            <h2>Scan QR Code</h2>
            <video ref={videoRef} className="qr-video" />
            {error && <p className="error-message">{error}</p>}
            <Dialog visible={showPopup} onHide={handleClose} className="qr-popup-container">
                <h3>Animal Details</h3>
                {animal ? (
                    <>
                        <p>Name: {animal.name}</p>
                        {/* <img src={getImageForSpecies(animal.name)} alt={animal.animalSpeciesName} className="animal-image" /> */}
                        {/* <p>ID: {animal.id}</p> */}
                        {/* <p>Animal ID: {animal.animalId}</p> */}
                        {/* <p>Species ID: {animal.animalSpeciesId}</p> */}
                        {/* <p>Species Name: {animal.animalSpeciesName}</p>
                        
                        <p>Enclosure ID: {animal.enclosureId}</p>
                        <p>Birth Date: {animal.birthDate}</p>
                        <p>Birth Country: {animal.birthCountry}</p>
                        <p>Description: {animal.description}</p> */}
                    </>
                ) : (
                    <p className="qr-popup">{error}</p>
                )}
                {/* <Button label="Close" onClick={handleClose} /> */}
            </Dialog>
            <div className="qr-popup-backdrop" style={{
                display: showPopup ? 'block' : 'none'
            }}></div>
        </div>
    );

};

export default Attendance;