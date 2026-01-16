const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

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
