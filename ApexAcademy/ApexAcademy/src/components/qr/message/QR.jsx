
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from "react"; 
import QRCode from 'qrcode';
import { useState } from 'react';
//import {Container, Card, CardContent, makeStyles, Grid, TextField, Button} from '@material-ui/core';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import QrScanner from 'qr-scanner';
import { useRef } from 'react';
import './QR.css';

function QR() {
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [scanResultFile, setScanResultFile] = useState('');
  //const [scanResultWebCam, setScanResultWebCam] =  useState('');
  //const classes = useStyles();
  const qrRef = useRef(null);

  const generateQrCode = async () => {
    try {
          const response = await QRCode.toDataURL(text);
          setImageUrl(response);
    }catch (error) {
      console.log(error);
    }
  }

  const handleErrorFile = (error) => {
    console.log(error);
  }
  const handleScanFile = (result) => {
      if (result) {
          setScanResultFile(result);
      }
  }
  const onScanFile = () => {
    qrRef.current.openImageDialog();
  }
  
  return (
    <>
    <div className='qr-main'>
    <Grid container spacing={2}>
        <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
    <TextField id="outlined-basic" label="Enter Student ID" variant="outlined" 
    onChange={(e) => setText(e.target.value)}/>
<br/>
<br/>
    <Button variant="contained" onClick={() => generateQrCode()}>Generate</Button>
   

                            <br/>
                            <br/>
                            <br/>
                            {imageUrl ? (
                              <a href={imageUrl} download>
                                  <img src={imageUrl} alt="img"/>
                              </a>) : null}
              </Grid>
              </Grid>  

              
                      {/* <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
                        
                        <Button variant="contained" onClick={onScanFile}>Scan Qr Code</Button>
                        <QrScanner
                          ref={qrRef}
                          delay={300}
                          style={{width: '100%'}}
                          onError={handleErrorFile}
                          onScan={handleScanFile}
                          legacyMode
                        />
                        <h3>Scanned Code: {scanResultFile}</h3>
                      </Grid> */}
                 </div>     
    </>
  );
}

export default QR;

