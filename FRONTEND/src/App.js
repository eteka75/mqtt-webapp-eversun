import React from "react";
import "./App.css";
import Device from "./components/Device";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Device />
      </header>
    </div>
  );
}

export default App;
/*import React from "react";
//import "./App.css";
import Device from "./components/Device";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Device deviceName="smartPlug1" />
      </header>
    </div>
  );
}

export default App;
*/
/*import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const Device = ({ deviceName }) => {
  const [deviceData, setDeviceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDeviceData();

    const interval = setInterval(() => {
      fetchDeviceData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchDeviceData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9000/api/device/${deviceName}`
      );
      setDeviceData(response.data.data[0]);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    const newState = deviceData.state === "ON" ? "OFF" : "ON";
    try {
      await axios.post(`http://localhost:9000/api/device/${deviceName}/set`, {
        state: newState,
      });
      fetchDeviceData();
    } catch (err) {
      setError(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading device data.</p>;

  return (
    <div className="App">
      <h1>{deviceName}</h1>
      <p>Current Power: {deviceData.currentPower}</p>
      <p>Total Power Consumption: {deviceData.totalPowerConsumption}</p>
      <p>State: {deviceData.state}</p>
      <button onClick={handleToggle}>
        {deviceData.state === "ON" ? "Turn OFF" : "Turn ON"}
      </button>
    </div>
  );
};

export default Device;



/*import React, { useEffect, useState } from "react";
import mqtt from "mqtt";

const App = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Connexion au broker MQTT
    const client = mqtt.connect("mqtt://localhost:1883");

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client.subscribe("test/topic", (err) => {
        if (err) {
          console.error("Subscription error:", err);
        } else {
          console.log("Subscribed to test/topic");
        }
      });
    });

    client.on("message", (topic, message) => {
      console.log(`Received message: ${message.toString()}`);
      setMessages((prevMessages) => [...prevMessages, message.toString()]);
    });

    // Nettoyage lors du démontage du composant
    return () => {
      client.end();
    };
  }, []);

  return (
    <div>
      <h1>MQTT Messages</h1>
      <ul>
        {console.log("messages", messages)}
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;

import React, { useEffect, useState } from "react";

const App = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Se connecter au serveur WebSocket
    const ws = new WebSocket("ws://localhost:3000");

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <h1>MQTT Messages</h1>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            {msg.message} (topic: {msg.topic})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;*/
