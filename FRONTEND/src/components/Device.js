import React, { useState, useEffect } from "react";
import axios from "axios";

const Device = () => {
  const [apiUrl, setApiUrl] = useState("http://localhost:3001");
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedDevices, setSelectedDevices] = useState(null);
  const [deviceMessages, setDeviceMessages] = useState([]);
  const [simulDevice, setSimulDevice] = useState("");

  const handleSimulation = () => {
    simulateDevice(simulDevice);
  };

  const handleChange = (event) => {
    setSimulDevice(event.target.value);
  };

  useEffect(() => {
    const env_url = process.env.REACT_APP_API_URL;
    setApiUrl(env_url);
    fetchDevices();
    if (devices && devices.length > 0) {
      setSelectedDevice(devices[0]);
    }
  }, []);

  useEffect(() => {
    if (selectedDevice) {
      fetchDeviceMessages(selectedDevice);
    }
  }, [selectedDevice]);

  const dateToFr = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) {
      throw new Error("Date invalide");
    }
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return new Intl.DateTimeFormat("fr-FR", options).format(date);
  };

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/devices`);
      const deviceNames = response?.data?.data.map(
        (device) => device.deviceName
      );
      setDevices(deviceNames);
    } catch (error) {
      console.error("Error fetching device messages:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchDeviceMessages = async (deviceName) => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/device/${deviceName}`);
      console.log(response.data);
      setDeviceMessages(response.data?.data);
    } catch (error) {
      console.error("Error fetching device messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDeviceState = async (deviceName, currentState) => {
    const newState = currentState === "ON" ? "OFF" : "ON";
    setLoading(true);

    try {
      await axios.post(`${apiUrl}/api/device/${deviceName}/set`, {
        state: newState,
      });
      fetchDevices();
      fetchDeviceMessages(deviceName); // Refresh
    } catch (error) {
      console.error("Error toggling device state:", error);
    } finally {
      setLoading(false);
    }
  };
  const simulateDevice = async (deviceName) => {
    //valeurs aléatoires
    if (!deviceName) return;
    const currentPower = Math.floor(Math.random() * 1000) + "W";
    const totalPowerConsumption = (Math.random() * 100).toFixed(1) + "kWh";
    const state = Math.random() < 0.5 ? "ON" : "OFF"; // Aléatoire ON ou OFF

    // JSON
    const message = JSON.stringify({
      deviceName,
      currentPower,
      totalPowerConsumption,
      state,
    });
    //app.post("/api/device/:name/publish"

    try {
      const response = await axios.post(
        `${apiUrl}/api/device/${deviceName}/publish`,
        { message }
      );
      fetchDevices();
      console.log("Command executed successfully:", response.data);
    } catch (error) {
      console.error("Error executing command:", error);
    }
  };

  if (loading) return <p>Chargement...</p>;
  return (
    <div>
      <h1>Tableau de bord : MQTT Device </h1>
      <h2>Simulation</h2>
      <div>
        <select
          className="select_simulation"
          onChange={handleChange}
          value={simulDevice}
        >
          <option value={""}>Sélectionnez</option>
          <option value={"smartPlug1"}>smartPlug1</option>
          <option value={"smartPlug2"}>smartPlug2</option>
          <option value={"smartPlug3"}>smartPlug3</option>
        </select>
        <button onClick={handleSimulation}>Simuler</button>
      </div>
      <div>
        <h2>Liste des devices</h2>
        <ul>
          {devices.map((device) => (
            <li
              key={device}
              className={
                "" + device === selectedDevice ? "tbold shand " : "tlight shand"
              }
              onClick={() => setSelectedDevice(device)}
            >
              {device}
            </li>
          ))}
        </ul>
        <p>{devices.length === 0 && <div>Aucun divice pour le moment</div>}</p>
      </div>
      <div className="border mt-large">
        {selectedDevice && deviceMessages[0] && (
          <div>
            <h2>{deviceMessages[0]?.deviceName}</h2>
            <ul>
              <li>
                Device Name: <b>{deviceMessages[0]?.deviceName}</b>
              </li>
              <li>
                Current Power: <b>{deviceMessages[0]?.currentPower}</b>
              </li>
              <li>
                Total Power Consumption:{" "}
                <b>{deviceMessages[0]?.totalPowerConsumption}</b>
              </li>
              <li>
                Timestamp: <b>{dateToFr(deviceMessages[0]?.timestamp)}</b>
              </li>
              <li>
                State: <b>{deviceMessages[0]?.state}</b>
              </li>
            </ul>
            {!loading && (
              <button
                disabled={loading}
                onClick={() =>
                  toggleDeviceState(selectedDevice, deviceMessages[0]?.state)
                }
              >
                Turn {deviceMessages[0]?.state === "ON" ? "OFF" : "ON"}
              </button>
            )}
            <h4>Historique</h4>
            <ul className="lhistory">
              {deviceMessages.map((device, index) => (
                <li>
                  {dateToFr(device?.timestamp)}
                  <div className="gris">
                    {" • "} State : {device?.state} {" • "} CP:
                    {"    "}
                    {deviceMessages[0]?.currentPower}
                    {" • "} TPC: {deviceMessages[0]?.totalPowerConsumption}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {(!selectedDevice || !deviceMessages[0]) && (
          <div className="noinfo ">
            <b>Aucun device sélectionné</b>
            <br></br>
            <div className="gris"> Veuillez sélectionnez un device...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Device;
