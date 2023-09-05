import React from "react";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import Visualizer from "./components/visual";
import "../src/App.css";
import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsFillBellFill,
} from "react-icons/bs";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

function Home() {
  const [messages, setMessages] = useState([]);
  const [newMessages, setNewMessages] = useState([]);
  const [myResult, setMyResult] = useState(" ");
  const [displayData, setDisplayData] = useState([0]);
  const [index, setIndex] = useState(0);
  const [socketIo, setSocketIo] = useState(null);
  const windowSize = 500;
  const updateFunc = (messages2, index2) => {
    setDisplayData([...displayData, messages2[index2]]);
    index2++;
    setIndex(index2);
  };
  useEffect(() => {
    if (messages[index]) {
      updateFunc(messages, index);
    }
    // setDisplayData((prevData) => [...prevData, messages[index]]);
    // setIndex((prevIndex) => prevIndex + 1);

    // if (messages[index]) {

    //   setDisplayData((prevData) => [...prevData, messages[index]]);
    //   setIndex((prevIndex) => prevIndex + 1);
    // }
    //displayData.slice(-windowSize, 1)
  }, [messages, index]);

  function handleConnect() {
    console.log("Connecting to AWS Websocket Server...");
    const newSocketIo = io.connect("http://18.234.23.199:4000");
    // const newSocketIo = io.connect("http://localhost:4000");
    newSocketIo.once("connect", () => {
      console.log("Connected to Server with ClientID:\n" + newSocketIo.id);
    });
    newSocketIo.on("send", (message) => {
      const newMessageValues = message
        .split(",")
        .map((value) => parseInt(value));
      setNewMessages(newMessageValues);
      setMessages((prevData) => [...prevData, ...newMessageValues]);
      console.log(message);
    });
    newSocketIo.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
    // newSocketIo.on("result", (message) => {
    //   setMyResult(message);
    // });
    setSocketIo(newSocketIo); // Store the socket instance
  }

  function handleSwitchOn() {
    console.log("Switching on the Device");
    if (socketIo) {
      socketIo.emit("status", "ON");
      console.log("Success");
    } else {
      console.log("Please connect to the Server.");
    }
  }
  function handleSwitchOff() {
    console.log("Switching off the Device");
    if (socketIo) {
      socketIo.emit("status", "OFF");
      console.log("Success");
    } else {
      console.log("Please connect to the Server.");
    }
  }

  function handleDisconnect() {
    if (socketIo) {
      console.log("Disconnecting Client...");
      socketIo.disconnect(); // Disconnect the socket
      setSocketIo(null); // Clear the stored socket instance
      console.log("Disconnected");
      setDisplayData([0]);
    }
  }
  function handleData() {
    console.log("Connecting to Local Server...");
    const localSocket = io.connect("http://localhost:4000");
    setTimeout(() => {
      if(localSocket.connected == false){
        setMyResult("Local Server unable to connect.")
      }
    }, 1000); // 2000 milliseconds (2 seconds) delay
    localSocket.once("connect", () => {
      console.log("Connected to Local Server with ClientID:\n" + localSocket.id);
      localSocket.on("result", (result) => {
        setMyResult(result);
      });
    });
    
    localSocket.emit("function", "add");
  }

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>DASHBOARD</h3>
      </div>

      <div className="main-cards">
        <div className="card">
          <div className="card-inner">
            <h3>LAST HRV TEST</h3>
            <BsFillArchiveFill className="card_icon" />
          </div>
          <h1>02-05-2023</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>LAST 12 LEAD TEST</h3>
            <BsFillArchiveFill className="card_icon" />
          </div>
          <h1>12-05-2023</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>LAST 2 LEAD TEST</h3>
            <BsFillArchiveFill className="card_icon" />
          </div>
          <h1>23-05-2023</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>ALERTS</h3>
            <BsFillBellFill className="card_icon" />
          </div>
          <h1>42</h1>
        </div>
      </div>

      <div className="main-title">
        <h3>LIVE ECG DATA</h3>
      </div>
      <div className="charts">
        <Visualizer mydata={displayData}>chart</Visualizer>
      </div>
      <div className="main-title">
        <h3>ACTIONS</h3>
        <div>
          <button onClick={handleConnect} type="button" className="btns">
            Connect
          </button>
          <button onClick={handleDisconnect} type="button" className="btns">
            Disconnect
          </button>
          <button onClick={handleSwitchOn} type="button" className="btns">
            Start Test
          </button>
          <button onClick={handleSwitchOff} type="button" className="btns">
            End Test
          </button>
          <button onClick={handleData} type="button" className="btns">
            Connect to Local
          </button>
        </div>
      </div>
      <div className="main-title">
        <h3>RESULT</h3>
        <textarea value={myResult} readOnly></textarea>
      </div>
    </main>
  );
}

export default Home;
