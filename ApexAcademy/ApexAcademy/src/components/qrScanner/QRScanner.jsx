import React, { useEffect, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import QrScanner from 'qr-scanner';
import axios from 'axios';
import Swal from 'sweetalert2';
import './QRScanner.css';
QrScanner.WORKER_PATH = '/qr-scanner-worker.min.js';
import StudentsEnrollTable from "../studentEnroll/areaTable/AreaTable";

const Attendance = () => {
    const videoRef = useRef(null);
    const [error, setError] = useState('');
    const [scannerActive, setScannerActive] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [attendanceMethod, setAttendanceMethod] = useState('');
    const [qrMessage, setQrMessage] = useState('');
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

    const resetForm = () => {
        setFormData(initialFormData);
        setIsReady(false);
        setAttendanceMethod('');
        setError('');
        setQrMessage('');
        stopScanner(); // Stop the scanner if it's running
    };

    const handleReadyClick = async () => {
        try {
            const response = await axios.get(`http://localhost:8085/api/v1/subject/${formData.subjectId}`);
            if (response.status === 200) {
                setIsReady(true);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Subject ID',
                    text: 'The entered subject ID is not valid. Please try again.',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Subject ID',
                text: 'The entered subject ID is not valid. Please try again.',
            });
        }
    };

    const handleSubmit = async (studentId) => {
        try {
            const dataToSend = {
                subjectId: formData.subjectId,
                studentId,
                date: formData.date,
                status: true,
            };

            const response = await axios.post('http://localhost:8085/api/v1/attendance/mark', dataToSend);

            if (response.data.statusCodeValue === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Attendance Marked Successfully',
                    text: 'Student attendance has been marked successfully!',
                });
                setFormData(prevData => ({ ...prevData, studentId: '' }));
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to mark Attendance.',
                    text: response.data.body,
                });
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            Swal.fire({
                icon: 'error',
                title: 'Failed to Mark Attendance',
                text: 'Failed to mark attendance. Please try again later.',
            });
        }
    };

    const handleQrResult = async (result) => {
        if (result) {
            const studentId = result.data;
            setFormData((prevData) => ({
                ...prevData,
                studentId,
            }));

            try {
                const dataToSend = {
                    subjectId: formData.subjectId,
                    studentId,
                    date: formData.date,
                    status: true,
                };

                const response = await axios.post('http://localhost:8085/api/v1/attendance/mark', dataToSend);

                if (response.data.statusCodeValue === 200) {
                    setQrMessage('Attendance Marked Successfully for student ID: ' + studentId);
                } else {
                    setQrMessage('Failed to mark Attendance for student ID: ' + studentId);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                setQrMessage('Error: Failed to mark attendance. Please try again later.');
            }
        } else {
            setQrMessage('No QR code found.');
        }
    };

    const startScanner = () => {
        if (videoRef.current) {
            const constraints = { video: { width: 1280, height: 720, facingMode: "environment" } };
            navigator.mediaDevices.getUserMedia(constraints)
                .then(stream => {
                    videoRef.current.srcObject = stream;
                    const scanner = new QrScanner(videoRef.current, handleQrResult, (error) => {
                        console.error(error);
                        setError('Failed to scan QR code');
                    });

                    setQrScanner(scanner);

                    // Start scanning when an object is within 0-20cm distance
                    const checkDistance = () => {
                        const videoTrack = stream.getVideoTracks()[0];
                        if (videoTrack && videoTrack.getCapabilities && videoTrack.getSettings) {
                            const capabilities = videoTrack.getCapabilities();
                            if (capabilities.focusDistance) {
                                const range = capabilities.focusDistance;
                                const objectDistance = range.max;
                                if (objectDistance >= 0 && objectDistance <= 0.2) {
                                    scanner.start().then(() => {
                                        setScannerActive(true);
                                    }).catch(err => {
                                        console.error(err);
                                        setError('Unable to access the camera or QR scanner.');
                                    });
                                } else {
                                    setScannerActive(false);
                                }
                            } else {
                                // Handle case where focusDistance is not supported
                                console.warn('focusDistance capability is not supported.');
                                setScannerActive(false);
                            }
                        } else {
                            console.warn('Video track capabilities or settings are not available.');
                            setScannerActive(false);
                        }
                        requestAnimationFrame(checkDistance);
                    };
                    checkDistance();
                })
                .catch(error => {
                    console.error('Error accessing media devices:', error);
                    setError('Unable to access the camera or QR scanner.');
                });
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

    const handleAttendanceMethod = (method) => {
        setAttendanceMethod(method);
        setQrMessage(''); // Clear QR message if attendance method changes
        stopScanner(); // Stop the scanner if the attendance method changes
    };

    return (
        <>
            <StudentsEnrollTable />
            <div className="attendance-container">
                {!isReady ? (
                    <div className="form-container">
                        <h2>Enter Subject ID</h2>
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
                        <button className="button-custom" onClick={handleReadyClick}>Ready</button>
                        <button className="button-custom button-secondary" onClick={resetForm}>Reset</button>
                    </div>
                ) : (
                    <>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="subjectId">Subject ID</Form.Label>
                            <Form.Control
                                id="subjectId"
                                value={formData.subjectId}
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="date">Attendance Date</Form.Label>
                            <Form.Control
                                id="date"
                                type="date"
                                value={formData.date}
                                readOnly
                            />
                        </Form.Group>
                        <div className="method-selection">
                            <button className="button-custom" onClick={() => handleAttendanceMethod('studentId')}>Attendance by Student ID</button>
                            <button className="button-custom" onClick={() => handleAttendanceMethod('qr')}>Attendance by QR Code</button>
                            <button className="button-custom button-secondary" onClick={resetForm}>Reset</button>
                        </div>

                        {attendanceMethod === 'studentId' && (
                            <div className="form-container">
                                <h2>Mark Attendance by Student ID</h2>
                                <Form onSubmit={(e) => { e.preventDefault(); handleSubmit(formData.studentId); }}>
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
                                    <button className="button-custom" type="submit">Mark Attendance</button>
                                </Form>
                            </div>
                        )}

                        {attendanceMethod === 'qr' && (
                            <div className="qr-scanner-container">
                                <h2>Scan QR Code (0cm - 20cm Distance)</h2>
                                <video ref={videoRef} className="qr-video" />
                                {scannerActive ? (
                                    <button className="button-custom button-danger" onClick={stopScanner}>Stop Scanner</button>
                                ) : (
                                    <button className="button-custom" onClick={startScanner}>Start Scanner</button>
                                )}
                                {error && <p className="error">{error}</p>}
                                {qrMessage && <p className="message">{qrMessage}</p>}
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default Attendance;
