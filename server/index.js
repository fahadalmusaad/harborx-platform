const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// === AI ROUTES START ===

app.get("/api/shipments", (req, res) => {
  res.json([
    {
      id: "PILOT-001",
      origin: "Shanghai",
      destination: "Jeddah",
      status: "In Transit"
    },
    {
      id: "PILOT-002",
      origin: "Ningbo",
      destination: "Dammam",
      status: "Booked"
    }
  ]);
});

// === AI ROUTES END ===

app.get("/", (req, res) => {
  res.json({
    product: "HARBORX",
    status: "API is running 🚢",
    mode: "pilot"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("HARBORX API running on port", PORT);
});
