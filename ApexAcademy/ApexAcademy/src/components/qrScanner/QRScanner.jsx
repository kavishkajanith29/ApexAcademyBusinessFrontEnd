import React, { useEffect, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import axios from 'axios';
import Swal from 'sweetalert2';
import './QRScanner.css';

import QrScanner from 'react-qr-scanner';

import StudentsEnrollTable from "../studentEnroll/areaTable/AreaTable";

const Attendance = () => {

    const [error, setError] = useState('');
    
    const [scanning, setScanning] = useState(false); 
    const [apiResponse, setApiResponse] =  useState('');
    const [isRequesting, setIsRequesting] = useState(false);

    const [isReady, setIsReady] = useState(false);
    const [attendanceMethod, setAttendanceMethod] = useState('');

    const initialFormData = {
        subjectId: '',
        studentId: '',
        date: new Date().toISOString().split('T')[0],
    };
    const [formData, setFormData] = useState(initialFormData);

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
        setApiResponse('');
        setIsRequesting(false);
        setScanning(false);

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

    const handleAttendanceMethod = (method) => {
        setAttendanceMethod(method);
    };
    
    
    const handleAbsence = async () => {
        const absenceData = {
            subjectId: formData.subjectId,
            date: formData.date,
        };
    
        // Show a warning message before sending the request
        const warningResult = await Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to mark absences. This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, mark absences',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
        });
    
        if (warningResult.isConfirmed) {
            try {
                const response = await axios.post('http://localhost:8085/api/v1/attendance/mark-absents', absenceData);
    
                // Show a confirmation message after successfully marking absences
                await Swal.fire({
                    title: 'Absences Marked!',
                    text: 'Absences have been marked successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6',
                });
    
                // Optionally, you can handle the response here if needed
                console.log('Response:', response.data);
            } catch (error) {
                // Handle and display error message
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to mark absences. Please try again later.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#d33',
                });
                console.error('Error marking absences:', error);
            }
        }
    };

    const handleScan = async (data) => {
        if (data && !isRequesting) {
            setIsRequesting(true);
            
            const dataToSend = {
            subjectId: formData.subjectId,
            studentId: data.text,
            date:  formData.date,
            status: true,
          };
    
          try {
            const response = await axios.post('http://localhost:8085/api/v1/attendance/mark', dataToSend);
            if(response.data.body.attendanceId){
              setApiResponse(data.text)
            }else{
              setApiResponse(data.text + " "+ response.data.body)
            }
          } catch (error) {
            console.error('Error marking attendance:', error);
          }finally {
            setIsRequesting(false);
            clearStudentId(); // Clear studentId after each scan
          }
        }
      };
    
      const handleError = (err) => {
        console.error(err);
      };
    
      const previewStyle = {
        height: "255px",
        width: "255pxpx",
      };
    
      const videoConstraints = {
        facingMode: 'environment', // Use the back camera for better QR scanning
        frameRate: { ideal: 240 }, // Increase the frame rate for smoother scanning
      };
      const clearStudentId = () => {
        // Clear the studentId field
        setFormData({ ...formData, studentId: '' });
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
                            <button className="button-custom" style={{backgroundColor:"#d9544e"}} onClick={handleAbsence}>Mark Absence</button>
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
                                <h2>Scan QR Code </h2>
                                {scanning !== true ? <button className="button-custom" onClick={() => setScanning(true) }>Start Scanning</button>
                                         : <button className="button-custom " style={{backgroundColor:"#d9544e"}}  onClick={() => {
                                            setScanning(false);
                                            setApiResponse('');
                                          }}>
                                            Stop Scanning</button>
                                    }
                                    {
                                        scanning === true ? 
                                        <div >
                                        <QrScanner
                                        className="qr-video"
                                        delay={100} // Reduce delay for faster scanning
                                        style={previewStyle}
                                        onError={handleError}
                                        onScan={handleScan}
                                        constraints={{ video: videoConstraints }} // Apply video constraints
                                        />
                                        </div>
                                        :
                                        <div></div>
                                    }
                                    {apiResponse.length > 9 ?
                                        <p className='error'>{apiResponse}</p>
                                     : 
                                        <p className='message'>{apiResponse}</p>
                                     }
                                    
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default Attendance;
