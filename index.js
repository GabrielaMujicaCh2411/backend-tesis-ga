const express = require("express");
const cors = require("cors");

require("dotenv").config();
require("./sql/connection");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
// Antes de definir tus rutas
app.use(cors());

// Rutas principales
const mainRoutes = require("./routes/route");
app.use("/", mainRoutes);

// Rutas específicas auth
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

// Rutas específicas auth
const adminRoutes = require("./routes/admin");
app.use("/admin", adminRoutes);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});