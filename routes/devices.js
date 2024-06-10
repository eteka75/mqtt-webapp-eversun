const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const config = require("../config/config.json");
const mqttClient = require("../utils/mqttClient");

// BDD SQLite
let db = new sqlite3.Database(config.database.filename, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the devices database.");
});

// les différents deviceName enrégistrés
router.get("/devices", (req, res) => {
  db.all(`SELECT DISTINCT deviceName FROM device_data`, [], (err, datas) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: datas,
    });
  });
});

//les informations d'un device
router.get("/device/:name", (req, res) => {
  const deviceName = req.params.name;
  db.all(
    `SELECT * FROM device_data WHERE deviceName = ? ORDER BY timestamp DESC`,
    [deviceName],
    (err, mrows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: mrows,
      });
    }
  );
});

// Route pour publier un message et enregistrer les données
router.post("/device/:name/publish", (req, res) => {
  const deviceName = req.params.name;
  const datas = JSON.parse(req.body?.message);
  const { currentPower, totalPowerConsumption, state } = datas;
  const message = {
    deviceName,
    currentPower,
    totalPowerConsumption,
    state,
  };
  // Publier le message sur MQTT
  mqttClient.publishMessage(
    `${config.mqtt.topicPrefix}/${deviceName}`,
    message
  );
  // Insérer les données dans la base de données
  db.run(
    `INSERT INTO device_data (deviceName, currentPower, totalPowerConsumption, state)
         VALUES (?, ?, ?, ?)`,
    [deviceName, currentPower, totalPowerConsumption, state],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: message,
        id: this.lastID,
      });
    }
  );
});

// Route pour mettre à jour l'état d'un device
router.post("/device/:name/set", (req, res) => {
  const deviceName = req.params.name;
  const newState = req.body.state;
  console.log("MOP", newState, deviceName);
  mqttClient.publishMessage(`${config.mqtt.topicPrefix}/${deviceName}/set`, {
    state: newState,
  });

  res.send("State change published");
});

module.exports = router;
