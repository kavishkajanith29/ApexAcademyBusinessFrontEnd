import React, { useEffect, useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import QrScanner from 'qr-scanner';
import axios from 'axios';
import Swal from 'sweetalert2';
import './QRScanner.css';
QrScanner.WORKER_PATH = '/qr-scanner-worker.min.js';
import StudentsEnrollTable  from "../studentEnroll/areaTable/AreaTable";

const Attendance = () => {
    const videoRef = useRef(null);
    const [error, setError] = useState('');
    const [scannerActive, setScannerActive] = useState(false);
    const initialFormData = {
        subjectId: '',
        studentId: '',
        date: new Date().toISOString().split('T')[0],
    };
    const [formData, setFormData] = useState(initialFormData);
    const [qrScanner, setQrScanner] = useState(null);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try 
        {
            const dataToSend = {
                subjectId: formData.subjectId,
                studentId: formData.studentId,
                date: formData.date,
                status: true,
            };
            
            const response = await axios.post('http://localhost:8085/api/v1/attendance/mark', dataToSend);

            if (response.data.statusCodeValue === 200) {
            // Show success message
            Swal.fire({
                icon: 'success',
                title: 'Attendance Marked Successfully',
                text: 'Student attendance has been marked successfully!',
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Failed to mark Attendance.',
                text: response.data.body,
            });
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        // Show error message
        Swal.fire({
            icon: 'error',
            title: 'Failed to Mark Attendance',
            text: 'Failed to mark attendance. Please try again later.',
        });
    }
};

    const handleQrResult = (result) => {
        const [studentId, subjectId] = result.data.split('-');
        setFormData((prevData) => ({
            ...prevData,
            studentId,
            subjectId,
        }));
    };

    const startScanner = () => {
        if (videoRef.current) {
            const scanner = new QrScanner(videoRef.current, handleQrResult, (error) => {
                console.error(error);
                setError('Failed to scan QR code');
            });

            setQrScanner(scanner);

            scanner.start().catch(err => {
                console.error(err);
                setError('Unable to access the camera.');
            });

            setScannerActive(true);
        }
    };

    const stopScanner = () => {
        if (qrScanner) {
            qrScanner.stop();
            setScannerActive(false);
        }
    };

    useEffect(() => {
        return () => {
            if (qrScanner) {
                qrScanner.destroy();
            }
        };
    }, [qrScanner]);

    return (
        <>
        <StudentsEnrollTable/>
        <div className="attendance-container">
            <div className="form-container">
                <h2>Mark Attendance</h2>
                <Form onSubmit={handleSubmit}>
                    <fieldset>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="subjectId">Subject ID</Form.Label>
                            <Form.Control
                                id="subjectId"
                                placeholder="Enter Subject ID"
                                onChange={handleChange}
                                value={formData.subjectId}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="date">Attendance Date</Form.Label>
                            <Form.Control
                                id="date"
                                type="date"
                                onChange={handleChange}
                                value={formData.date}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="studentId">Student ID</Form.Label>
                            <Form.Control
                                id="studentId"
                                placeholder="Enter Student ID"
                                onChange={handleChange}
                                value={formData.studentId}
                                required
                            />
                        </Form.Group>

                        <Button type="submit">Mark Attendance</Button>
                    </fieldset>
                </Form>
            </div>

            <div className="qr-scanner-container">
                <h2>Scan QR Code</h2>
                <video ref={videoRef} className="qr-video" />
                {scannerActive ? (
                    <Button variant="danger" onClick={stopScanner}>Stop Scanner</Button>
                ) : (
                    <Button variant="primary" onClick={startScanner}>Start Scanner</Button>
                )}
                {error && <p className="error">{error}</p>}
            </div>
        </div>
        </>
    );
};

export default Attendance;
