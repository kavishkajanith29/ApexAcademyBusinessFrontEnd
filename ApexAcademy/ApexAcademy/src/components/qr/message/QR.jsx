import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from "react"; 
import QRCode from 'qrcode';
import { useState, useRef } from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import axios from 'axios';
import html2canvas from 'html2canvas';
import './QR.css';

function QR() {
  const [studentId, setStudentId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [studentData, setStudentData] = useState(null);
  const cardRef = useRef(null);

  const generateQrCode = async (data) => {
    try {
      const response = await QRCode.toDataURL(data);
      setImageUrl(response);
    } catch (error) {
      console.log(error);
    }
  }

  const handleStudentIdChange = async (e) => {
    const id = e.target.value;
    setStudentId(id);
    if (id) {
      try {
        const response = await axios.get(`http://localhost:8085/api/v1/student/${id}`);
        const studentData = response.data;
        const formattedDate = studentData.registrationdate.split(' ')[0]; // Extract date part
        const qrData = studentData.studentid;
        setStudentData({ ...studentData, registrationdate: formattedDate });
        generateQrCode(qrData);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    }
  }

  const downloadIdCard = async () => {
    const canvas = await html2canvas(cardRef.current);
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `${studentData.studentid}_id_card.png`;
    link.click();
  }

  const printIdCard = async () => {
    const canvas = await html2canvas(cardRef.current);
    const imgData = canvas.toDataURL('image/png');

    const printWindow = window.open();
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <body onload="window.print(); window.close();">
          <img src="${imgData}" />
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  return (
    <div className='qr-main'>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
          <TextField 
            id="outlined-basic" 
            label="Enter Student ID" 
            variant="outlined" 
            onChange={handleStudentIdChange}
            value={studentId}
            style={{width:'300px'}}
          />
          <br />
          <br />
          {studentData && (
            <div ref={cardRef} className='id-card'>
              <div className='id-card-header'>
                <h2>APEX Business Acadamy <br/>(pvt) LTD</h2>
                <h6>Student Identity Card</h6>
              </div>
              {imageUrl && (
                <div className='qr-code-container'>
                  <img src={imageUrl} alt="QR Code" />
                </div>
              )}
              <div className='student-info'>
                <p><strong>Name : </strong> {studentData.studentname}</p>
                <p><strong>Student No : </strong> {studentData.studentid}</p>
                <p><strong>Registration Date:</strong> {studentData.registrationdate}</p>
              </div>
            </div>
          )}
          {studentData && (
            <div>
              {/* <Button variant="contained" color="primary" onClick={downloadIdCard} style={{marginTop:20,marginLeft:50}}>
                Download ID Card
              </Button> */}
              <Button variant="contained" color="secondary" onClick={printIdCard} style={{marginTop:20,marginLeft:70}}>
                Print ID Card
              </Button>
            </div>
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export default QR;
