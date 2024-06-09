const mqtt = require("mqtt");
const sqlite3 = require("sqlite3").verbose();
const config = require("../config/config.json");

// Initialiser la base de données SQLite
let db = new sqlite3.Database(config.database.filename, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the devices database.");
});

// Créer une table si elle n'existe pas
db.run(`CREATE TABLE IF NOT EXISTS device_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  deviceName TEXT,
  currentPower TEXT,
  totalPowerConsumption TEXT,
  state TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Connexion au broker MQTT Mosquitto
const client = mqtt.connect(config.mqtt.brokerUrl);

client.on("connect", () => {
  console.log("Connected to MQTT broker");
  client.subscribe(`${config.mqtt.topicPrefix}/#`, (err) => {
    if (err) {
      console.error("Subscription error:", err);
    }
  });
});

client.on("message", (topic, message) => {
  try {
    const deviceName = topic.split("/")[1];
    const jsonString = transformToJSON(message.toString());
    const data = JSON.parse(jsonString);

    // Déstructuration pour extraire les valeurs que je veux
    const { currentPower, totalPowerConsumption, state } = data;

    db.run(
      `INSERT INTO device_data (deviceName, currentPower, totalPowerConsumption, state)
        VALUES (?, ?, ?, ?)`,
      [deviceName, currentPower, totalPowerConsumption, state],
      function (err) {
        if (err) {
          return console.log(err.message);
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
      }
    );
  } catch (err) {
    console.error("Failed to parse message:", err);
  }
});
function publishMessage(topic, newState) {
  const deviceName = topic.split("/")[1];
  // Récupérer le dernier enregistrement de la base de données pour le deviceName spécifié
  db.get(
    `SELECT * FROM device_data WHERE deviceName = ? ORDER BY timestamp DESC LIMIT 1`,
    [deviceName],
    (err, lastRecord) => {
      if (err) {
        console.error("Failed to retrieve last record:", err);
        return;
      }

      if (!lastRecord) {
        console.error("No records found for device:", deviceName);
        return;
      }

      // Combiner les informations de l'enregistrement avec le newState
      const combinedMessage = {
        deviceName: deviceName,
        currentPower: lastRecord.currentPower,
        totalPowerConsumption: lastRecord.totalPowerConsumption,
        state: newState.state,
      };

      // Publier le message MQTT
      client.publish(topic, JSON.stringify(combinedMessage), (err) => {
        if (err) {
          console.error("Failed to publish message:", err);
        } else {
          console.log("Message published");
        }
      });
    }
  );
}

/*
function publishMessage(topic, message) {
  console.log("mQTT Client reçois ce message :", topic);
  client.publish(topic, JSON.stringify(message), (err) => {
    if (err) {
      console.error("Failed to publish message:", err);
    } else {
      console.log("Message published");
    }
  });
}*/

function transformToJSON(rawString) {
  // Ajouter des guillemets
  let jsonString = rawString.replace(/([a-zA-Z0-9_]+)\s*:/g, '"$1":');
  jsonString = jsonString.replace(/:\s*([a-zA-Z0-9.]+)/g, ':"$1"');

  return jsonString;
}
module.exports = { publishMessage };
