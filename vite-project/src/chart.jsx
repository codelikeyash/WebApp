import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const WebSocketClient = () => {
  const [messages, setMessages] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const socketIo = io.connect('http://35.175.204.233:8000');
    socketIo.once('connect', () => {
      console.log(socketIo.id);
    })
    socketIo.on('rmsg', (message) => {
      setMessages(prevData => [
        ...prevData,
        ...message.split(",").map(value => parseInt(value))
      ])
      console.log(message)
    });

    socketIo.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }, []);

  useEffect(() => {
    if (messages[index]) {
      setDisplayData(prevData => [...prevData, messages[index]]);
      setIndex(prevIndex => prevIndex + 1);
    }
  }, [index, messages]);

  return (
    <div>
      <div>
      <h1>Real-time Device Data</h1>
      </div>
      <div>
        <h2>Customer's Profile</h2>
      </div>
      <div>
        <h2>ECG Test</h2>
        <button>Connect</button>
        <button>Disconnect</button>
        <button>Reconnect</button>
      </div>
      <div></div>
      <div>
        <h2>Ecg Screen</h2>
        {/* <Visualizer mydata={displayData}></Visualizer> */}
      </div>
    </div>
  );
};

export default WebSocketClient;

