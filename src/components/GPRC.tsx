import React, { useState } from 'react';
import SentGRPCMsg from './Service';
import axios from 'axios';

const GRPC: React.FC = () => {

  const [msg, setMsg] = useState<string>('');
  const [color, setColor] = useState<string>('black');

  async function SentGRPC() {
    SetMessage('GRPC Message sent!', 'black');
    SentGRPCMsg((message, color) => { SetMessage(message, color); });
  }

  async function SentHTTP1() {
    try {
      const response = await axios.get('http://localhost:8080/test');
      SetMessage("HTTP Response: " + response.data, 'green');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        SetMessage('Axios Error:' + error.response?.data || error.message + error, 'red');
      } else {
        SetMessage('Error:' + error, 'red');
      }
    }
  }

  function SetMessage(msg: string, color: string) {
    setColor(color);
    setMsg(msg);
  }

  return (
    <>
      <div className='d-flex flex-column gap-2 align-items-center'>
        <h1>gRPC React Demo</h1>
        <div className='d-flex gap-2'>
          <button className='btn-success' onClick={SentGRPC}>GRPC</button>
          <button className='btn-success' onClick={SentHTTP1}>HTTP1</button>
        </div>
        {msg && <p className='fw-bold text-center' style={{ color: `${color}` }}>{msg}</p>}
      </div>
    </>
  );

};

export default GRPC;