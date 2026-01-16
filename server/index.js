const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// === AI ROUTES START ===

const pilotShipments = [
  {
    id: "HX-001",
    importer: "ACME_TRADING",
    shippingLine: "MAERSK",
    origin: "Shanghai",
    destination: "Jeddah",
    status: "CREATED",
    createdAt: "2026-01-01"
  },
  {
    id: "HX-002",
    importer: "ACME_TRADING",
    shippingLine: "MSC",
    origin: "Ningbo",
    destination: "Dammam",
    status: "IN_TRANSIT",
    createdAt: "2026-01-02"
  }
];

// GET shipments (role-based)
app.get("/api/shipments", (req, res) => {
  const role = 
    req.headers['role'] ||
    req.query.role;

  const name = 
    req.headers['name'] ||
    req.query.name;

  if (!role || !name) {
    return res.status(400).json({
      error: "Missing role or name in (headers or query)'
    });
  }

  let result = [];

  if (role === "importer") {
    result = pilotShipments.filter(
      s => s.importer === name
    );
  }

  if (role === "shipping_line") {
    result = pilotShipments.filter(
      s => s.shippingLine === name
    );
  }

  res.json(result);
});

// GET shipment by ID
app.get("/api/shipments/:id", (req, res) => {
  const shipment = pilotShipments.find(
    s => s.id === req.params.id
  );

  if (!shipment) {
    return res.status(404).json({
      error: "Shipment not found"
    });
  }

  res.json(shipment);
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
