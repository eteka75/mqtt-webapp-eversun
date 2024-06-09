const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const deviceRoutes = require("./routes/devices");

const app = express();
const port = 3001;

// Express pour utiliser body-parser et cors
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use("/api", deviceRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
