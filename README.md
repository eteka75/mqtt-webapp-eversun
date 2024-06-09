# MQTT WebApp

## Prérequis

- Node.js et npm
- Mosquitto installé localement
- SQLite3

## Installation

### Mosquitto, Node.js & Npm

Pour tester le bon fonctionnement de `Mosquitto` suivez les étapes suivantes:

1. Installer Node.js et npm

2. Installer et configurer Mosquitto

- Telécharger et installer Mosquitto
- Ajouter le dossier d'installation de Mosquitto aux variables d'environnement `C:\Program Files\mosquitto`
- Lancer Mosquitto en ligne de commande
  ```bash
  mosquitto
  ```

4. Commande de publication
   Ouvrez une ligne de commande et tapez :
   ```bash
   mosquitto_sub -h localhost -t test/smartPlug1
   ```
5. Commande de souscription
   Ouvrez une nouvelle ligne de commande et tapez ensuite :
   ```bash
   mosquitto_pub -h localhost -t test/smartPlug1 -m '{"deviceName":"smartPlug1","currentPower":"269W","totalPowerConsumption":"82.1kWh","state":"OFF"}'
   ```
   Si le message s'affiche au niveau de la première console, cela signifie que tout se passe bien:
   `{deviceName:smartPlug1,currentPower:269W,totalPowerConsumption:82.1kWh,state:OFF}`

### Backend NODE JS

1. Naviguez vers le dossier `mqtt-nodejs-server` :
   ```bash
   cd mqtt-nodejs-server
   ```
2. Installez les dépendances :

   ```bash
   npm i
   ```

3. Configurez la connexion MQTT dans `config/config.json` :

   ```bash
       {
           "mqtt": {
               "host": "mqtt://localhost",
               "port": 1883,
               "topicPrefix": "testTech"
           },
           "database": {
               "filename": "./devices_db.db"
           }
       }
   ```

4. Démarrez le serveur :

   ```bash
   node server.js
   ```

### Frontend

1. Se déplacer vers de dossier Frontend `FRONTEND`

   ```bash
   cd FRONTEND
   ```

2. Installer les dépendances :

   ```bash
   npm i
   ```

   ou

   ```bash
   npm install
   ```

3. Configurer les variables d'environnement :

   ```bash
    PORT = 3000
    REACT_APP_API_URL = http://localhost:3001
   ```

4. Démarrez l'application :

   ```bash
   npm start
   ```
